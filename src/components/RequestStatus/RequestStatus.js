import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Icon, Card, Alert, Dropdown, Button, Menu } from 'antd';

import getUserrequestStatus from 'modules/userrequestStatus';
import { getUserGroup } from 'modules/authentication';
import { updateState, updateApproved } from 'modules/userrequestList';

import styles from './RequestStatus.module.scss';
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

const getEvaluationFromOptions = (options, value) => (
  options.find(option => option.value === value)
);

const EvaluationMenu = ({ actions, handleClick }) => (
  <Menu className={styles.dropdownMenu}>
    {actions.map(action => (
      <Menu.Item key={`status_${action.value}`} onClick={() => handleClick(action.value)} style={{ width: '100%' }}>
        <Icon type={action.icon} className={styles[action.icon]} />{action.label}
      </Menu.Item>
    ))}
  </Menu>
);

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
      { type: 'default', label: 'En attente d\'information du demandeur', value: 1, icon: 'pause' },
      { type: 'primary', label: 'Approuver', value: 2, icon: 'check' },
      { type: 'danger', label: 'Refuser', value: -1, icon: 'close' },
    ];
    // TODO: set real user uuid when API ready
    const userUuid = 'uuid3';
    const selfApprobation = getEvaluationFromOptions(actionsN1, approbations[userUuid]);
    return (
      <Card title="Évaluation de niv 1">
        <Status state={state} approbations={approbations} userGroup={userGroup} />
        <div className={styles.actions}>
          <p>Votre approbation :</p>
          <Dropdown
            overlay={(
              <EvaluationMenu
                actions={actionsN1}
                handleClick={val => onApproved(userrequest, 'uuid3', val)}
              />
            )}
            trigger={['click']}
          >
            <Button className={styles.actionsButton}>
              <span className={styles.actionsButtonLabel}>
                <Icon className={styles[selfApprobation.icon]} type={selfApprobation.icon} />
                &nbsp;{selfApprobation.label}
              </span> <Icon type="down" />
            </Button>
          </Dropdown>
        </div>
      </Card>
    );
  }

  if (userGroup === 'N2') {
    const actionsN2 = [
      { type: 'default', label: 'En attente d\'information du demandeur', value: 200, icon: 'pause' },
      { type: 'primary', label: 'Approuver', value: 300, icon: 'check' },
      { type: 'danger', label: 'Refuser', value: -1, icon: 'close' },
    ];

    return (
      <Card title="Évaluation de niv 2">
        <Status state={state} approbations={approbations} userGroup={userGroup} />
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12 }}>
          {actionsN2.map(action => (
            <Button
              key={action.label}
              type={action.type}
              style={{ margin: 6 }}
              // TODO: change 'uuid3' by real N2 uuid when API ready
              onClick={() => onChangeStatus(userrequest, 'uuid3', action.value)}
            >
              <Icon type={action.icon} /> {action.label}
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
    onChangeStatus: updateState,
    onApproved: updateApproved,
  }, dispatch);

export default connect(StateToProps, DispatchToProps)(RequestStatus);

