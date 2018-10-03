import React from 'react';
import { Switch, Route } from 'react-router-dom';
import PermissionsRoute from './PermissionsRoute';

export const SubRoutes = ({ routes, ...props }) => (
  <Switch>
    {routes.map(route => (
      <PermissionsRoute
        permissions={route.permissions}
      >
        <Route
          {...route}
          key={route.path}
          path={route.path}
        />
      </PermissionsRoute>
    ))}
    <Route {...props} />
  </Switch>
);

export default SubRoutes;
