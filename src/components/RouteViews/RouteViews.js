import React from 'react';
import { withRouter, Route, Switch } from 'react-router-dom';

import Error404 from 'components/Error404/Error404';
import withAuthentication from 'hoc/authentication';
import routes from 'modules/routes';
import Layout from 'components/Layout/Layout';
import SubRoutes from './SubRoutes';
import AuthRoute from './AuthRoute';

const hasSubRoutes = route => route.routes && route.routes.length;

export const RouteViews = ({ isAuthenticated, location }) => (
  <Switch>
    {routes.map(route => (
      <Route
        key={route.path}
        {...route}
        exact={route.exact && !hasSubRoutes(route)}
        component={props => (
          <AuthRoute
            {...route}
            isAuthenticated={isAuthenticated}
            location={location}
          >
            <Layout {...route.layout}>
              {hasSubRoutes(route)
                ? <SubRoutes {...props} {...route} />
                : <route.component />}
            </Layout>
          </AuthRoute>
        )}
      />
    ))}

    <Layout>
      <Error404 />
    </Layout>
  </Switch>
);

export default withRouter(withAuthentication(RouteViews));
