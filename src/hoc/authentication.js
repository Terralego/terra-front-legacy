import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { logout, getUserGroup } from 'modules/authentication';

const withAuthentication = WrappedComponent => {
  const Component = props => <WrappedComponent {...props} />;

  const mapStateToProps = state => ({
    isAuthenticated: state.authentication.isAuthenticated,
    user: state.authentication.payload && state.authentication.payload.user,
    userGroup: getUserGroup(state),
  });

  const mapDispatchToProps = dispatch =>
    bindActionCreators({ logout }, dispatch);

  return connect(mapStateToProps, mapDispatchToProps)(Component);
};

export default withAuthentication;
