import React from 'react';
import { connect } from 'react-redux';
import { Alert } from 'antd';

import { getUserGroup } from 'modules/authentication';
import getUserrequestStatus from 'modules/userrequestStatus';

/**
 * Status
 *
 * @param {number} userrequestState - status of the userrequest
 * @param {string} userGroup - current user's group
 * @param {object} approbations - userrequest approbations
 */
export const Status = ({ userrequestState, userGroup, approbations }) => {
  if (!userrequestState) {
    return null;
  }

  // TODO: connect userId with API when ready
  // Temporary userId parameter 'uuid2'
  const { text, type } = getUserrequestStatus(userrequestState, approbations, userGroup, 'uuid2');
  return <Alert message={text} type={type || 'info'} />;
};

const StateToProps = state => ({
  userGroup: getUserGroup(state),
  uuid: state.authentication.payload && state.authentication.payload.user.uuid,
});

export default connect(StateToProps, null)(Status);

