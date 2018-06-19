import React from 'react';
import { connect } from 'react-redux';
import { Alert } from 'antd';

import { getUserGroup } from 'modules/authentication';
import getUserrequestStatus from 'modules/userrequestStatus';

/**
 * Status
 *
 * @param {number} userrequestState - status of the userrequest
 * @param {object} user - user's group
 * @param {string} user.group - user's group
 * @param {string} user.uuid - user's uuid
 * @param {object} approbations - userrequest approbations
 */
export const Status = ({ userrequestState, user, approbations }) => {
  if (!userrequestState || !user) {
    return null;
  }

  const { text, type } = getUserrequestStatus(userrequestState, approbations, user);
  return <Alert message={text} type={type || 'info'} />;
};

const StateToProps = state => ({
  user: {
    group: getUserGroup(state),
    uuid: state.authentication.payload && state.authentication.payload.user.uuid,
  },
});

export default connect(StateToProps, null)(Status);

