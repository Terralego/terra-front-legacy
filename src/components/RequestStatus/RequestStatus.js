import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Icon, Card, Alert, Dropdown, Button, Menu, List } from 'antd';
import classnames from 'classnames';

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
  if (!state) {
    return null;
  }

  // TODO: connect userId with API when ready
  // Temporary userId parameter 'uuid2'
  const { text, type } = getUserrequestStatus(state, approbations, userGroup, 'uuid2');
  return <Alert message={text} type={type || 'info'} />;
};

const getEvaluationFromOptions = (options, value) => (
  options.find(option => option.value === value)
);

const EvaluationMenu = ({ actions, handleClick }) => (
  <Menu className={styles.dropdownMenu}>
    {actions.map(action => (
      <Menu.Item className={classnames(styles.dropdownItem, styles[action.icon])} key={`status_${action.value}`} onClick={() => handleClick(action.value)} style={{ width: '100%' }}>
        <Icon type={action.icon} />{action.label}
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
      { label: 'En attente d\'information du demandeur', value: 1, icon: 'pause' },
      { label: 'Approuver', selectedLabel: 'Approuvée', value: 2, icon: 'check' },
      { label: 'Refuser', selectedLabel: 'Refusée', value: -1, icon: 'close' },
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
            <Button className={classnames(styles.actionsButton, styles[selfApprobation.icon])}>
              <span className={styles.actionsButtonLabel}>
                <Icon type={selfApprobation.icon} />
                &nbsp;{selfApprobation.selectedLabel || selfApprobation.label}
              </span> <Icon type="down" />
            </Button>
          </Dropdown>
        </div>
      </Card>
    );
  }

  if (userGroup === 'N2') {
    const actionsN2 = [
      { label: 'En attente', value: 200, icon: 'pause' },
      { label: 'Approuver', value: 300, icon: 'check' },
      { label: 'Refuser', value: -1, icon: 'close' },
    ];
    const selfEvaluation = getEvaluationFromOptions(actionsN2, state);
    return (
      <Card title="Évaluation de niv 2">
        <div styles={{ textAlign: 'center' }}>
          <p>Status de la demande :</p>
          <Dropdown
            overlay={(
              <EvaluationMenu
                actions={actionsN2}
                handleClick={val => onChangeStatus(userrequest.id, val)}
              />
            )}
            trigger={['click']}
          >
            <Button className={classnames(styles.actionsButton, styles[selfEvaluation.icon])}>
              <span className={styles.actionsButtonLabel}>
                <Icon type={selfEvaluation.icon} />
                &nbsp;{selfEvaluation.selectedLabel || selfEvaluation.label}
              </span> <Icon type="down" />
            </Button>
          </Dropdown>

          <List
            size="small"
            dataSource={approbations}
            renderItem={n1 => <List.Item>{console.log(n1)}{approbations[n1]}</List.Item>}
          />
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

