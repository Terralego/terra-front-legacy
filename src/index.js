import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Raven from 'raven-js';
import settings from 'front-settings';

import { setAuthentication, refreshToken } from 'modules/authentication';
import { enableTimerRefreshToken } from 'modules/authenticationTimer';
import { getSettings } from 'modules/appConfig';

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
      <Component />
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
if (store.getState().authentication.isAuthenticated) {
  store.dispatch(refreshToken());
  store.dispatch(enableTimerRefreshToken());
}

/**
 * Initial rendering
 */
render(App);

// registerServiceWorker();
unregisterServiceWorker();
