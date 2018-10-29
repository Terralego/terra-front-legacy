import React from 'react';
import { Redirect } from 'react-router-dom';

import withAuthentication from 'hoc/authentication';

export const AuthRoute = ({
  children,
  isUser,
  user = {},
  protected: isProtected,
  isAuthenticated,
  path,
  location: { pathname },
}) => {
  const shouldRedirectToLogin = isProtected && !isAuthenticated;

  if (shouldRedirectToLogin) {
    return (
      <Redirect
        to={{ pathname: '/login', state: { from: pathname } }}
        from={pathname}
      />
    );
  }

  // Redirect user if properties are empty.
  const shouldRedirectToProfile = isUser
    && isAuthenticated
    && typeof user.properties === 'object'
    && !Object.keys(user.properties).length
    && path !== '/create-profile';

  if (shouldRedirectToProfile) {
    return (
      <Redirect
        to={{ pathname: '/create-profile', state: { from: pathname } }}
        from={pathname}
      />
    );
  }

  return children;
};

export default withAuthentication(AuthRoute);
