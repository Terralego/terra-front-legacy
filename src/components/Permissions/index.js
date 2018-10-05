import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

export const Permissions = ({
  children,
  permissions,
  groups,
  userGroups,
  userPermissions,
  renderFail: Fail,
}) => {
  const goPermissions = permissions.length
    ? permissions.some(permission => userPermissions.includes(permission))
    : null;
  const goGroups = groups.length
    ? groups.some(group => userGroups.includes(group))
    : null;
  const go = !(goPermissions === false || goGroups === false);
  if (typeof children === 'function') {
    return children(go);
  }

  return go
    ? children
    : <Fail />;
};

Permissions.propTypes = {
  permissions: PropTypes.arrayOf(PropTypes.string),
  groups: PropTypes.arrayOf(PropTypes.string),
  userPermissions: PropTypes.arrayOf(PropTypes.string),
  userGroups: PropTypes.arrayOf(PropTypes.string),
  renderFail: PropTypes.func,
};

Permissions.defaultProps = {
  permissions: [],
  groups: [],
  userPermissions: [],
  userGroups: [],
  renderFail: () => null,
};

export default connect(state => {
  const { payload = {} } = state.authentication;
  const { user = {} } = payload;
  const { permissions: userPermissions, groups: userGroups } = user;
  return {
    userPermissions,
    userGroups,
  };
})(Permissions);
