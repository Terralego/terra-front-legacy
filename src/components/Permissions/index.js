import React from 'react';
import PropTypes from 'prop-types';
import withAuthentication from 'hoc/authentication';

export const Permissions = ({
  children,
  permissions,
  user: {
    permissions: userPermissions,
  } = {},
  renderFail: Fail,
}) => {
  const go = !permissions.length || permissions.reduce((can, permission) =>
    can || userPermissions.includes(permission), false);

  return go
    ? children
    : <Fail />;
};

Permissions.propTypes = {
  permissions: PropTypes.arrayOf(PropTypes.string),
  renderFail: PropTypes.func,
};

Permissions.defaultProps = {
  permissions: [],
  renderFail: () => null,
};

export default withAuthentication(Permissions);
