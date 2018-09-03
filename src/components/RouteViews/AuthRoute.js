import React from 'react';
import { Redirect } from 'react-router-dom';

export const AuthRoute = ({
  children,
  isUser,
  user: { properties } = {},
  protected: isProtected,
  isAuthenticated,
  location: { pathname },
}) => {
  if (isProtected && !isAuthenticated) {
    return (
      <Redirect
        to={{ pathname: '/login',
          state: {
            from: pathname,
          } }}
        from={pathname}
      />
    );
  }

  // Redirect user if properties are empty.
  if (isUser && isAuthenticated &&
      typeof properties === 'object' &&
      !Object.keys(properties).length &&
      pathname !== '/create-profile') {
    return (
      <Redirect
        to={{
          pathname: '/create-profile',
          state: {
            from: pathname,
          },
        }}
        from={pathname}
      />
    );
  }

  return children;
};

export default AuthRoute;
