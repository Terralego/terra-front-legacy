import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Card, Alert, Button } from 'antd';

import getUserrequestStatus from 'modules/userrequestStatus';
import { getUserGroup } from 'modules/authentication';
import { updateRequestProperties, updateState, updateApproved } from 'modules/userrequest';

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
 * @param {void} onApproved - change userrequest state (only for N1)
 * @param {void} updateState - change userrequest state (only for N2)
 */
const RequestStatus = ({ userrequest, userGroup, onApproved, onChangeStatus }) => {
  const { state } = userrequest;
  const { approbations } = userrequest.properties;

  if (userGroup === 'N1') {
    const actionsN1 = [
      { label: 'Approuver', value: 2 },
      { label: 'Refuser', value: -1 },
      { label: 'En attente', value: 1 },
    ];
    return (
      <Card title="Évaluation de niv 1">
        <Status state={state} approbations={approbations} userGroup={userGroup} />
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12 }}>
          {actionsN1.map(action => (
            <Button
              key={action.label}
              style={{ margin: 6 }}
              // TODO: change 'uuid3' by real N1 uuid when API ready
              onClick={() => onApproved(userrequest, 'uuid3', action.value)}
            >
              {action.label}
            </Button>
          ))}
        </div>
      </Card>
    );
  }

  if (userGroup === 'N2') {
    const actionsN2 = [
      { label: 'Approuver', value: 300 },
      { label: 'Refuser', value: -1 },
      { label: 'En attente', value: 200 },
    ];

    return (
      <Card title="Évaluation de niv 2">
        <Status state={state} approbations={approbations} userGroup={userGroup} />
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12 }}>
          {actionsN2.map(action => (
            <Button
              key={action.label}
              style={{ margin: 6 }}
              // TODO: change 'uuid3' by real N2 uuid when API ready
              onClick={() => onChangeStatus(userrequest, 'uuid3', action.value)}
            >
              {action.label}
            </Button>
          ))}
        </div>
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
  bindActionCreators({
    updateRequestProperties,
    onChangeStatus: updateState,
    onApproved: updateApproved,
  }, dispatch);

export default connect(StateToProps, DispatchToProps)(RequestStatus);

