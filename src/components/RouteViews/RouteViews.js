import React from 'react';
import { withRouter, Route, Redirect, Switch } from 'react-router-dom';

import Error404 from 'components/Error404/Error404';
import withAuthentication from 'hoc/authentication';
import routes from 'modules/routes';
import Layout from 'components/Layout/Layout';

const CustomRoute = ({ route, layout, ...props }) => (
  <Layout {...layout} routes={route.routes}>
    <route.component {...props} routes={route.routes} />
  </Layout>
);

const RouteViews = props => {
  // wrap <Route> and use this everywhere instead, then when
  // sub routes are added to any route it'll work
  const RouteWithSubRoutes = route => (
    <Route
      exact={route.exact}
      path={route.path}
      render={() => {
        // If user try to access a protected route and is not authenticated
        if (route.protected && !props.isAuthenticated) {
          return (
            <Redirect
              to={{ pathname: '/login', state: { from: props.location.pathname } }}
              from={props.location.pathname}
            />
          );
        }

        // Redirect user if properties are empty.
        if (props.userGroup === 'user' &&
        props.isAuthenticated && typeof props.user.properties === 'object' &&
        !Object.keys(props.user.properties).length
        && props.location.pathname !== '/profile') {
          return (
            <Redirect
              to={{ pathname: '/profile', state: { from: props.location.pathname } }}
              from={props.location.pathname}
            />
          );
        }

        return (
          <CustomRoute
            {...props}
            route={route}
            layout={route.layout}
          />
        );
      }}
    />
  );

  // Concatenate all routes for child views
  const routesViews = [...routes];
  routes.forEach(route => {
    if (route.routes) {
      routesViews.push(...route.routes);
    }
  });

  return (
    <Switch>
      {routesViews.map(route => (<RouteWithSubRoutes key={route.path} {...route} />))}
      <CustomRoute
        {...props}
        route={{ name: 'Error404', component: Error404 }}
        layout=""
      />
    </Switch>
  );
};

export default withRouter(withAuthentication(RouteViews));
