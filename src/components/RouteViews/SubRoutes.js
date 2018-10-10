import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Permissions from 'components/Permissions';
import Error401 from 'components/Error401';

export const SubRoutes = ({ routes, path, ...props }) => (
  <Switch>
    {routes.map(({ component: Component, permissions, groups, ...route }) => (
      <Route
        {...route}
        key={route.path}
        path={`${path}${route.path}`}
        component={componentProps => (
          <Permissions
            permissions={permissions}
            groups={groups}
            renderFail={Error401}
          >
            <Component {...componentProps} />
          </Permissions>
        )}
      />
    ))}
    <Route
      path={path}
      {...props}
    />
  </Switch>
);

export default SubRoutes;
