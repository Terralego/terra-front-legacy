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
 * @param {string} userrequestExpiry - expiration's date of the userrequest (format: YYYY-MM-DD)
 */
export const Status = ({ userrequestState, user, approbations, userrequestExpiry }) => {
  if (!userrequestState || !user) {
    return null;
  }

  const {
    text,
    type,
  } = getUserrequestStatus(userrequestState, approbations, user, userrequestExpiry);
  return <Alert message={text} type={type || 'info'} />;
};

const mapStateToProps = state => ({
  user: {
    group: getUserGroup(state),
    uuid: state.authentication.payload && state.authentication.payload.user.uuid,
  },
});

export default connect(mapStateToProps, null)(Status);

