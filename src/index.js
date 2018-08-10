import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Raven from 'raven-js';
import settings from 'front-settings';
import { I18nextProvider } from 'react-i18next';

import { setAuthentication, refreshToken } from 'modules/authentication';
import { getSettings } from 'modules/appConfig';

import i18n from './i18n';
import './index.css';
import store from './store';
import App from './App';
// import registerServiceWorker from './registerServiceWorker';
import { unregister as unregisterServiceWorker } from './registerServiceWorker';

window.APP_SETTINGS = settings;

if (settings.SENTRY_PUBLIC_KEY && settings.SENTRY_PROJECT_ID) {
  Raven.config(`https://${settings.SENTRY_PUBLIC_KEY}@sentry.io/${settings.SENTRY_PROJECT_ID}`, {
    release: settings.VERSION,
    environment: 'development-test',
  }).install();
}

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <I18nextProvider i18n={i18n}>
        <Component />
      </I18nextProvider>
    </AppContainer>,
    document.getElementById('root'),
  );
};

if (module.hot) {
  module.hot.accept('./App', () => render(App));
}

// Fetch app config
store.dispatch(getSettings());

// init the store with the localStorage / sessionStorage data
store.dispatch(setAuthentication());
// enabling refresh token if user already authenticated
store.getState().authentication.isAuthenticated && store.dispatch(refreshToken());

/**
 * Initial rendering
 */
render(App);

// registerServiceWorker();
unregisterServiceWorker();
