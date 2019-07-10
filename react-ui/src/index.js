import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
// import { useLinkComponent } from '@shopify/polaris';
import { AppProvider } from '@shopify/polaris';
import '@shopify/polaris/styles.css';

import store, { history } from './store';

import './index.css';
import App from './App';
// import registerServiceWorker from './registerServiceWorker';

function AdapterLink({ url, ...rest }) {
  return <Link to={url} {...rest} />;
}

axios.defaults.withCredentials = true;

// useLinkComponent(AdapterLink);

// These values are used in development. They are defined in the .env file
const { REACT_APP_SHOPIFY_API_KEY, REACT_APP_SHOP_ORIGIN } = process.env;

const env = window.env || {};

// Express injects these values in the client script when serving index.html
const { SHOPIFY_API_KEY, SHOP_ORIGIN } = env;

const apiKey = REACT_APP_SHOPIFY_API_KEY || SHOPIFY_API_KEY;
const shop = REACT_APP_SHOP_ORIGIN || SHOP_ORIGIN;

const shopOrigin = shop && `https://${shop}`;

const target = document.getElementById('root');
render(
  <AppProvider apiKey={apiKey} shopOrigin={shopOrigin} linkComponent={AdapterLink} forceRedirect>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <App />
      </ConnectedRouter>
    </Provider>
  </AppProvider>,
  target
);

// registerServiceWorker();
