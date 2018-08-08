import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { logout, getUserGroups } from 'modules/authentication';
import { hasGroup } from 'helpers/permissionsHelpers';

const withAuthentication = WrappedComponent => {
  const Component = props => <WrappedComponent {...props} />;

  const mapStateToProps = state => {
    const groups = getUserGroups(state);
    return {
      isAuthenticated: state.authentication.isAuthenticated,
      user: state.authentication.payload && state.authentication.payload.user,
      groups,
      isStaff: hasGroup(groups, 'staff'),
      isUser: hasGroup(groups, 'user'),
    };
  };

  const mapDispatchToProps = dispatch =>
    bindActionCreators({ logout }, dispatch);

  return connect(mapStateToProps, mapDispatchToProps)(Component);
};

export default withAuthentication;
