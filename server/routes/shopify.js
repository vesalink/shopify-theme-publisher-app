/**
 * Routes for express app
 */
import crypto from 'crypto';
import express from 'express';
import ShopifyToken from 'shopify-token';
import ShopifyApi from 'shopify-api-node';
import logger from 'winston';

import { APP_HOME_ROUTE, APP_NAME, TRIAL_DAYS, APP_URL, AUTH_CALLBACK_ROUTE, INSTALL_PAGE, SCOPES, UNINSTALL_ROUTE } from '../config';

import { Models } from '../db';

const { Shop, Shop_app, Application } = Models;

const router = express.Router();

const moment = require('moment');

export default () => {
  const { SHOPIFY_API_KEY, SHOPIFY_API_SECRET } = process.env;

  const getShopifyToken = () =>
    new ShopifyToken({
      sharedSecret: SHOPIFY_API_SECRET,
      redirectUri: `${APP_URL}${AUTH_CALLBACK_ROUTE}`,
      scopes: SCOPES,
      apiKey: SHOPIFY_API_KEY
    });

  const getAppsHome = shop => `https://${shop}/admin/apps/`;

  // The home page of the app in Shopify Admin
  const getEmbeddedAppHome = shop => `${getAppsHome(shop)}${SHOPIFY_API_KEY}`;

  /**
   * Authenticates the shop with Shopify when accessing protected routes.
   * Returns a template file that redirects to the Shopify authorization page.
   * This mechanism is used to authorize an embedded app.
   * We need custom Javascript to escape the iframe as described in the docs.
   * See the "shopify_redirect" template for details.
   */
  const authenticate = (req, res) => {
    const { query, session } = req;

    const shop = query.shop || req.body.shop;

    logger.info('Authenticating shop %s', shop);

    if (!shop) {
      res.redirect(INSTALL_PAGE);
      return;
    }

    const shopifyToken = getShopifyToken();
    const nonce = shopifyToken.generateNonce();

    // Save the nonce to state to verify it in the callback route later on
    session.state = nonce;

    const shopName = shop.split('.')[0];

    const url = decodeURI(shopifyToken.generateAuthUrl(shopName, undefined, nonce));

    res.render('shopify_redirect', { url, shop });
  };

  /**
   * Creates an interface for accessing the Shopify API.
   * @param session A Shopify session with shop domain and access token
   */
  const getShopifyApi = session => {
    const {
      shopify: { shop: shopUrl, token }
    } = session;

    return new ShopifyApi({
      shopName: shopUrl.split('.')[0],
      accessToken: token
    });
  };

  /**
   * This method gets called when the app is installed.
   * Setup any webhooks or services you need on Shopify inside here.
   */
  const afterShopifyAuth = (session, req, res, next) => {
    const shopify = getShopifyApi(session);

    shopify.shop.get().then(shop_data => {
      session.shopify.isDevShop = shop_data.plan_name === 'affiliate';
      const shop_obj_for_db = {
        contact_email: shop_data.email,
        domain: shop_data.domain,
        address1: shop_data.address1,
        city: shop_data.city,
        country: shop_data.country_name,
        country_code: shop_data.country_code,
        created_at: shop_data.created_at,
        customer_email: shop_data.customer_email,
        email: shop_data.email,
        name: shop_data.name,
        phone: shop_data.phone,
        province: shop_data.province,
        province_code: shop_data.province_code,
        zip: shop_data.zip,
        currency: shop_data.currency,
        timezone: shop_data.timezone,
        iana_timezone: shop_data.iana_timezone,
        shop_owner: shop_data.shop_owner,
        money_format: shop_data.money_format,
        money_with_currency_format: shop_data.money_with_currency_format,
        taxes_included: shop_data.taxes_included,
        tax_shipping: shop_data.tax_shipping,
        plan_name: shop_data.plan_name,
        shopify_shop_id: shop_data.id,
        source: shop_data.source
      };
      Shop.findOrCreate({
        where: {
          myshopify_domain: session.shopify.shop
        },
        defaults: shop_obj_for_db
      }).spread((db_shop, created) => {
        if (!created) {
          Shop.update(shop_obj_for_db, { where: { id: db_shop.id } });
        }
        Application.findOne({ where: { app_name: APP_NAME } }).then(app => {
          Shop_app.findOrCreate({
            where: {
              application_id: app.id,
              shop_id: db_shop.id
            },
            defaults: {
              api_token: session.shopify.token,
              application_id: app.id,
              install_date: moment().format(),
              shop_id: db_shop.id,
              trial_end: moment().add(TRIAL_DAYS, 'days')
            }
          }).spread((shop_app, created) => {
            const now = moment().format();
            const trial_end = moment(shop_app.trial_end).format();
            let trialLeft = 0;
            if (trial_end > now) {
              trialLeft = moment(shop_app.trial_end)
                .startOf('day')
                .diff(moment().startOf('day'), 'days');
            }
            session.shopify.trialLeft = trialLeft;
            session.shopify.shop_app_id = shop_app.id;
            session.shopify.app_id = app.id;
            session.shopify.price_tier_id = shop_app.price_tier_id;
            session.shopify.money_format = shop_data.money_format;
            session.shopify.time_zone = shop_data.iana_timezone;
            session.shopify.shop_owner = shop_data.shop_owner;
            session.shopify.email = shop_data.email;
            if (!created) {
              Shop_app.update({ api_token: session.shopify.token }, { where: { id: shop_app.id } });
            }
            if (created || (!created && shop_app.deleted === true)) {
              // Register the uninstall webhook if fresh (new) app installation or re-installation
              const webhook = {
                topic: 'app/uninstalled',
                address: `${APP_URL}${UNINSTALL_ROUTE}`,
                format: 'json'
              };
              shopify.webhook.create(webhook);
            }
            req.shopify = getShopifyApi(session);
            return res.redirect(getEmbeddedAppHome(session.shopify.shop));
          });
        });
      });
    });
  };

  /**
   * Shopify calls this route after the merchant authorizes the app.
   * It needs to match the callback route that you set in app settings.
   */
  router.get(AUTH_CALLBACK_ROUTE, (req, res, next) => {
    const { query, session } = req;

    const { code, shop, state } = query;

    const shopifyToken = getShopifyToken();

    if (
      typeof state !== 'string' ||
      state !== session.state || // Validate the state.
      !shopifyToken.verifyHmac(query) // Validate the hmac.
    ) {
      return res.status(400).send('Security checks failed');
    }

    // Exchange the authorization code for a permanent access token.
    return shopifyToken
      .getAccessToken(shop, code)
      .then(token => {
        session.shopify = { shop, token };

        return afterShopifyAuth(session, req, res, next);
      })
      .catch(next);
  });

  const verifyWebhookHMAC = req => {
    const hmac = req.headers['x-shopify-hmac-sha256'];

    const digest = crypto
      .createHmac('SHA256', SHOPIFY_API_SECRET)
      .update(req.rawBody)
      .digest('base64');

    return digest === hmac;
  };

  /**
   * This endpoint recieves the uninstall webhook and cleans up data.
   * Add to this endpoint as your app stores more data. If you need to do a lot of work, return 200
   * right away and queue it as a worker job.
   */
  router.post(UNINSTALL_ROUTE, (req, res) => {
    if (!verifyWebhookHMAC(req)) {
      res.status(401).send('Webhook HMAC Failed');
      return;
    }

    Shop.findOne({ where: { myshopify_domain: req.headers['x-shopify-shop-domain'] }, raw: true }).then(db_shop => {
      Application.findOne({ where: { app_name: APP_NAME } }).then(app => {
        Shop_app.update({ deleted: 1, deleted_date: moment().format(), activated: 0, price_tier_id: 0, price_tier_date: null }, { where: { application_id: app.id, shop_id: db_shop.id } });
      });
      res.status(200).send('Uninstalled');
    });
  });

  /**
   * This middleware checks if we have a session.
   * If so, it attaches the Shopify API to the request object.
   * If there is no session or we have a different shop,
   * we start the authentication process.
   */
  const authMiddleware = (req, res, next) => {
    logger.info(`Checking for valid session: ${req.query.shop}`);
    const {
      session,
      query: { shop }
    } = req;

    if (!session) {
      authenticate(req, res);
      return;
    } else if (!session.shopify || (shop && session.shopify.shop !== shop)) {
      delete session.shopify;
      authenticate(req, res);
      return;
    }

    req.shopify = getShopifyApi(session);
    next();
  };

  router.use(authMiddleware);

  router.get('/logout', (req, res) => {
    const { shop } = req.session.shopify;

    delete req.session.shopify;

    res.redirect(getEmbeddedAppHome(shop));
  });

  /*
   * Checks if the session is still valid by making a basic API call, as described in:
   * https://stackoverflow.com/questions/14418415/shopify-how-can-i-handle-an-uninstall-followed-by-an-instant-re-install
   */
  const checkForValidSession = (req, res, next) => {
    logger.info(`Checking if the session is still valid: ${req.query.shop}`);
    const { session, shopify } = req;

    return shopify.shop
      .get()
      .then(shop_data => {
        const isDevShop = shop_data.plan_name === 'affiliate';
        if (session.shopify && session.shopify.isDevShop !== isDevShop) {
          logger.info('Destroy the Shopify reference: Shop plan changed');
          delete session.shopify;
          authenticate(req, res);
        } else {
          next();
        }
      })
      .catch(() => {
        // Destroy the Shopify reference
        logger.info('Destroy the Shopify reference: Uninstalled or store switched');
        delete session.shopify;
        authenticate(req, res);
      });
  };

  router.get(APP_HOME_ROUTE, checkForValidSession, (req, res) => {
    res.redirect('/');
  });

  return router;
};
