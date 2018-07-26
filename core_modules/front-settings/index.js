/**
 * Default settings
 */
const defaultSettings = {
  SITE_NAME: 'Terralego',
  API_URL: 'https://onf-staging.eu.ngrok.io/api', // TODO : change with generic API
  SOURCE_VECTOR_URL: 'https://onf-staging.eu.ngrok.io/api/layer', // TODO : change with generic API
  REFRESH_TOKEN: 300000,
  PAGE_SIZE: 10,
  TIME_TO_STALE: 300000, // 5 min
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
