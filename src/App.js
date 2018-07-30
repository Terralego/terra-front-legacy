import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { LocaleProvider } from 'antd';
import fr from 'antd/lib/locale-provider/fr_FR';
import 'moment/locale/fr';

import ErrorBoundary from 'components/ErrorBoundary/ErrorBoundary';
import RouteViews from 'components/RouteViews/RouteViews';

import { store } from './store';

const AppWrapper = () => (
  <ErrorBoundary>
    <LocaleProvider locale={fr}>
      <Provider store={store}>
        <Router>
          <RouteViews />
        </Router>
      </Provider>
    </LocaleProvider>
  </ErrorBoundary>
);

export default AppWrapper;
