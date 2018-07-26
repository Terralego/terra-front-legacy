module.exports = {
  rules: {
    'react/require-default-props': [0],
    'react/forbid-prop-types': [0],
  },
  extends: 'makina',
  env: {
    browser: true,
  },
  settings: {
    'import/resolver': {
      node:    { paths: [
        'custom_modules',
        'src',
        'core_modules',
      ] },
      webpack: { paths: [
        'custom_modules',
        'src',
        'core_modules',
      ] },
    },
  },
};
