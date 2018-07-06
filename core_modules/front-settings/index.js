/**
 * Default settings
 */
const defaultSettings = {
  SITE_NAME: 'Terralego',
  API_URL: 'https://onf-staging.eu.ngrok.io/api', // TODO : change with generic API
  SOURCE_VECTOR_URL: 'https://onf-staging.eu.ngrok.io/api/layer', // TODO : change with generic API
  REFRESH_TOKEN: 300000,
  PAGE_SIZE: 10,
};

/**
 * Generate envSettings from ENV variables prefixed by REACT_APP_
 */
const envSettings = Object.keys(process.env).reduce((acc, curr) => {
  const [, prefix, key] = /(.{10})(.*)/.exec(curr) || [];
  return prefix === 'REACT_APP_' ? { ...acc, [key]: process.env[curr] } : acc;
}, {});

/**
 * Merge both objects
 */
export default {
  ...defaultSettings,
  ...envSettings,
};
