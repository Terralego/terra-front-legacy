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
    ? permissions.reduce((can, permission) =>
      can || userPermissions.includes(permission), false)
    : null;
  const goGroups = groups.length
    ? groups.reduce((can, group) =>
      can || userGroups.includes(group), false)
    : null;
  return (
    (goPermissions === true || goGroups === true)
    ||
    (goPermissions === null && goGroups === null)
  )
    ? children
    : <Fail />;
};

Permissions.propTypes = {
  permissions: PropTypes.arrayOf(PropTypes.string),
  groups: PropTypes.arrayOf(PropTypes.string),
  renderFail: PropTypes.func,
};

Permissions.defaultProps = {
  permissions: [],
  groups: [],
  renderFail: () => null,
};

export default connect(state => {
  const { payload = {} } = state.authentication;
  const { user = {} } = payload;
  const { permissions: userPermissions = [], groups: userGroups = [] } = user;
  return {
    userPermissions,
    userGroups,
  };
})(Permissions);
