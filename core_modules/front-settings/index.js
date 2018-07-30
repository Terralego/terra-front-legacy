import packageJson from '../../package.json';

const BASE_URL = 'https://onf-staging.eu.ngrok.io';

/**
 * Default settings
 */
const defaultSettings = {
  SITE_NAME: 'Terralego',
  VERSION: packageJson.version,
  BASE_URL,
  API_URL: `${BASE_URL}/api`,
  SOURCE_VECTOR_URL: 'https://onf-staging.eu.ngrok.io/api/layer', // TODO : change with generic API
  REFRESH_TOKEN: 300000,
  PAGE_SIZE: 10,
  TIME_TO_STALE: 300000, // 5 min
  SENTRY_PUBLIC_KEY: '287261d54ab14908b2233ae38336570d',
  SENTRY_PROJECT_ID: '',
};

const prefixFiltering = scope => (acc, curr) => {
  const [, prefix, key] = /(.{10})(.*)/.exec(curr) || [];
  return prefix === 'REACT_APP_' ? { ...acc, [key]: scope[curr] } : acc;
};

/**
 * Generate envSettings from `process.env` variables prefixed by `REACT_APP_`
 */
const envSettings = Object.keys(process.env).reduce(prefixFiltering(process.env), {});

/**
 * Generate injectedSettings from `window` variables prefixed by `REACT_APP_`
 */
const injectedSettings = Object.getOwnPropertyNames(window).reduce(prefixFiltering(window), {});

/**
 * Merge both objects
 */
export default {
  ...defaultSettings,
  ...envSettings,
  ...injectedSettings,
};
