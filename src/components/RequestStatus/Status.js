import React from 'react';
import { Alert, Spin } from 'antd';

import getUserrequestStatus from 'modules/userrequestStatus';
import withAuthentication from '../../hoc/authentication';

/**
 * Status
 *
 * @param {object} userrequest - userrequest's data
 * @param {object} user - user's data
 */
export const Status = ({ userrequest, user }) => {
  if (!userrequest || !user) {
    return null;
  }

  if (userrequest.loading) {
    return 'loading...';
  }

  const {
    text,
    type,
  } = getUserrequestStatus(userrequest, user);
  return (
    <Spin spinning={userrequest.isLoading === true}>
      <Alert message={text} type={type || 'info'} />
    </Spin>
  );
};

export default withAuthentication(Status);

