import React from 'react';
import { withRouter, Route, Redirect, Switch } from 'react-router-dom';

import Error404 from 'components/Error404/Error404';
import withAuthentication from 'hoc/authentication';
import routes from 'modules/routes';
import Layout from 'components/Layout/Layout';

class RouteViews extends React.Component {
  shouldComponentUpdate (prevProps) {
    if (this.props.isAuthenticated !== prevProps.isAuthenticated
    || this.props.location.pathname !== prevProps.location.pathname) {
      return true;
    }

    return false;
  }

  render () {
    // wrap <Route> and use this everywhere instead, then when
    // sub routes are added to any route it'll work
    const RouteWithSubRoutes = route => (
      <Route
        exact={route.exact}
        path={route.path}
        render={() => {
          // If user try to access a protected route and is not authenticated
          if (route.protected && !this.props.isAuthenticated) {
            return (
              <Redirect
                to={{ pathname: '/login', state: { from: this.props.location.pathname } }}
                from={this.props.location.pathname}
              />
            );
          }

          // Redirect user if properties are empty.
          if (this.props.isUser &&
          this.props.isAuthenticated && typeof this.props.user.properties === 'object' &&
          !Object.keys(this.props.user.properties).length
          && this.props.location.pathname !== '/create-profile') {
            return (
              <Redirect
                to={{ pathname: '/create-profile', state: { from: this.props.location.pathname } }}
                from={this.props.location.pathname}
              />
            );
          }

          return (
            <Layout {...route.layout}>
              <route.component />
            </Layout>
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
        <Layout>
          <Error404 />
        </Layout>
      </Switch>
    );
  }
}

export default withRouter(withAuthentication(RouteViews));
