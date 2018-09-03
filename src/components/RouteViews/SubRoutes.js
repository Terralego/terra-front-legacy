import React from 'react';
import { Switch, Route } from 'react-router-dom';

export const SubRoutes = ({ routes, ...props }) => (
  <Switch>
    {routes.map(route => (
      <Route
        {...route}
        key={route.path}
        path={route.path}
      />
    ))}
    <Route {...props} />
  </Switch>
);

export default SubRoutes;
