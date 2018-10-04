import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Permissions from 'components/Permissions';
import Error401 from 'components/Error401';

export const SubRoutes = ({ routes, ...props }) => (
  <Switch>
    {routes.map(route => (
      <Permissions
        permissions={route.permissions}
        renderFail={Error401}
      >
        <Route
          {...route}
          key={route.path}
          path={route.path}
        />
      </Permissions>
    ))}
    <Route {...props} />
  </Switch>
);

export default SubRoutes;
