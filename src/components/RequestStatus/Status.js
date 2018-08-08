import React from 'react';
import { Alert } from 'antd';

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

  const {
    text,
    type,
  } = getUserrequestStatus(userrequest, user);
  return <Alert message={text} type={type || 'info'} />;
};

export default withAuthentication(Status);

