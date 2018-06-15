import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Card, Alert, Button } from 'antd';

import getUserrequestStatus from 'modules/userrequestStatus';
import { getUserGroup } from 'modules/authentication';
import { updateRequestProperties, updateState } from 'modules/userrequest';

/**
 * Status
 *
 * @param {number} state - status of the userrequest
 * @param {string} userGroup - current user's group
 * @param {object} approbations - userrequest approbations
 */
export const Status = ({ state, userGroup, approbations }) => {
  if (state) {
    // TODO: connect userId with API when ready
    // Temporary userId parameter 'uuid2'
    const status = getUserrequestStatus(state, approbations, userGroup, 'uuid2');
    return <Alert message={status.text} type={status.type || 'info'} />;
  }
  return null;
};

/**
 * RequestStatus
 *
 * @param {object} userrequest - userrequest object
 * @param {string} userGroup - user's group
 */
const RequestStatus = ({ userrequest, userGroup }) => {
  const { state } = userrequest;
  const { approbations } = userrequest.properties;

  if (userGroup === 'N1') {
    return (
      <Card title="Évaluation de niv 1">
        <Status state={state} approbations={approbations} userGroup={userGroup} />
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12 }}>
          <Button style={{ margin: 6 }}>Approuver</Button>
          <Button style={{ margin: 6 }}>Refuser</Button>
          <Button style={{ margin: 6 }}>En attente</Button>
        </div>
      </Card>
    );
  }

  if (userGroup === 'N2') {
    return (
      <Card title="Évaluation de niv 2">
        <Status state={state} approbations={approbations} userGroup={userGroup} />
      </Card>
    );
  }

  return (
    <Status state={state} approbations={approbations} userGroup={userGroup} />
  );
};

const StateToProps = state => ({
  userGroup: getUserGroup(state),
});

const DispatchToProps = dispatch =>
  bindActionCreators({ updateRequestProperties, updateState }, dispatch);

export default connect(StateToProps, DispatchToProps)(RequestStatus);

