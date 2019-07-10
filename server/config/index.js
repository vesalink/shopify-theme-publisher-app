export const ENV = process.env.NODE_ENV || 'development';
export const isProduction = ENV === 'production';
export const isDebug = ENV === 'development';
export const isClient = typeof window !== 'undefined';
export const isTest = ENV === 'test';

export const SCOPES = 'read_themes,write_themes';
export const APP_NAME = 'theme-publisher-app';
export const APP_URL = 'https://2a36e146.ngrok.io';
export const APP_HOME_ROUTE = '/home';
export const AUTH_CALLBACK_ROUTE = '/auth/callback';
export const INSTALL_PAGE = `https://apps.shopify.com/${APP_NAME}`;
export const UNINSTALL_ROUTE = '/uninstall';
export const TRIAL_DAYS = 7;
export const PER_PAGE = 10;

export const sessionSecret = process.env.SESSION_SECRET || 'AKIAIPWY2AKIAJFQJCXGYA5E67WTQWGLB6FTGGNA';
