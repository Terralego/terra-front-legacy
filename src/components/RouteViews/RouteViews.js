import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Route, Redirect } from 'react-router-dom';

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
      render={() => (
        route.protected && !props.isAuthenticated
          ?
            <Redirect
              to={{ pathname: '/login', state: { from: props.location.pathname } }}
              from={props.location.pathname}
            />
          : <CustomRoute
            {...props}
            route={route}
            layout={route.layout}
          />
      )}
    />
  );

  // Concatenate all routes for child views
  const routesViews = [...routes];
  routes.forEach(route => {
    if (route.routes) {
      routesViews.push(...route.routes);
    }
  });

  return routesViews.map(route => <RouteWithSubRoutes key={route.path} {...route} />);
};

const mapStateToProps = state => ({
  isAuthenticated: state.authentication.isAuthenticated,
});

export default withRouter(connect(mapStateToProps, null)(RouteViews));
