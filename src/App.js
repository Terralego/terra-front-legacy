import React from 'react';
import '@babel/polyfill';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { LocaleProvider } from 'antd';
import fr from 'antd/lib/locale-provider/fr_FR';
import 'moment/locale/fr';
import { I18nextProvider } from 'react-i18next';

import ErrorBoundary from 'components/ErrorBoundary/ErrorBoundary';
import RouteViews from 'components/RouteViews/RouteViews';

import i18n from './i18n';
import { store } from './store';

const AppWrapper = () => (
  <ErrorBoundary>
    <LocaleProvider locale={fr}>
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <Router>
            <RouteViews />
          </Router>
        </I18nextProvider>
      </Provider>
    </LocaleProvider>
  </ErrorBoundary>
);

export default AppWrapper;
