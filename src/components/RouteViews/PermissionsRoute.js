import React from 'react';
import withAuthentication from 'hoc/authentication';
import Error401 from 'components/Error401';

export const Permissions = ({
  children,
  permissions = [],
  user: {
    permissions: userPermissions,
  },
}) => {
  const go = permissions.reduce((can, permission) =>
    can && userPermissions.includes(permission), true);

  return go
    ? children
    : <Error401 />;
};

export default withAuthentication(Permissions);
