import React from 'react';
import { withRouter, Route, Switch } from 'react-router-dom';

import Permissions from 'components/Permissions';
import Error401 from 'components/Error401';
import Error404 from 'components/Error404';
import routes from 'modules/routes';
import Layout from 'components/Layout/Layout';
import SubRoutes from './SubRoutes';
import AuthRoute from './AuthRoute';

const hasSubRoutes = route => route.routes && route.routes.length;

export const RouteViews = ({ location }) => (
  <Switch>
    {routes.map(route => (
      <Route
        key={route.path}
        {...route}
        exact={route.exact && !hasSubRoutes(route)}
        component={props => (
          <AuthRoute
            {...route}
            location={location}
          >
            <Permissions
              permissions={route.permissions}
              groups={route.groups}
              renderFail={Error401}
            >
              <Layout {...route.layout}>
                {hasSubRoutes(route)
                  ? <SubRoutes {...props} {...route} />
                  : <route.component />}
              </Layout>
            </Permissions>
          </AuthRoute>
        )}
      />
    ))}

    <Layout>
      <Error404 />
    </Layout>
  </Switch>
);

export default withRouter(RouteViews);
