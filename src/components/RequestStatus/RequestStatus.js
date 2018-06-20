import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Icon, Card, Dropdown, Button, Menu, List } from 'antd';
import classnames from 'classnames';

import Status from 'components/RequestStatus/Status';
import { getUserGroup } from 'modules/authentication';
import { updateState, updateApproved } from 'modules/userrequestList';

import styles from './RequestStatus.module.scss';

const actionsN1 = [
  { label: 'En cours de traitement', value: 0, icon: 'pause' },
  { label: 'En attente d\'information du demandeur', value: 1, icon: 'pause' },
  { label: 'Approuver', selectedLabel: 'Approuvée', value: 2, icon: 'check' },
  { label: 'Refuser', selectedLabel: 'Refusée', value: -1, icon: 'close' },
];

const actionsN2 = [
  { label: 'En attente', value: 200, icon: 'pause' },
  { label: 'En attente d\'information du demandeur', value: 1, icon: 'pause' },
  { label: 'Approuver', value: 300, icon: 'check' },
  { label: 'Refuser', value: -1, icon: 'close' },
];

/**
 * getEvaluationFromValue
 *
 * @param {array} options - array of evaluations options
 * @param {number} value - selected option
 * @return {object} object of current selected option
 */
const getEvaluationFromValue = (options, value) => (
  options.find(option => option.value === value)
);

/**
 * getUsersApprobationList
 *
 * @param {object} approbations - array of approbations
 * @return {array} array of approbations by N1 identifier
 */
const getUsersApprobationList = approbations => {
  if (!approbations) {
    return [];
  }
  return Object.keys(approbations).map(uuid => ({ n1: uuid, value: approbations[uuid] }));
};

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
 * @param {object} user - user's group
 * @param {string} user.group - user's group
 * @param {string} user.uuid - user's uuid
 * @param {void} onApproved - change userrequest state (only for N1)
 * @param {void} updateState - change userrequest state (only for N2)
 */
const RequestStatus = ({ userrequest, user, onApproved, onChangeStatus }) => {
  if (!user) {
    return null;
  }
  console.log(userrequest);

  const { state } = userrequest;
  const { approbations } = userrequest.properties;

  const onN1ChangeStatus = val => {
    onApproved(userrequest, user.uuid, val);
    return onChangeStatus(userrequest.id, val);
  };

  if (user.group === 'N1') {
    const selfApprobation = getEvaluationFromValue(actionsN1, approbations[user.uuid]);
    return (
      <Card title="Évaluation de niv 1">
        <Status userrequestState={state} approbations={approbations} user={user} />
        <div className={styles.actions}>
          <p>Votre approbation :</p>
          <Dropdown
            overlay={(
              <EvaluationMenu
                actions={actionsN1}
                handleClick={val => onApproved(userrequest, user.uuid, val)}
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

  if (user.group === 'N2') {
    const selfEvaluation = getEvaluationFromValue(actionsN2, state);

    return (
      <Card title="Évaluation de niv 2">
        <div styles={{ textAlign: 'center' }}>
          <p>Status de la demande :</p>
          <Dropdown
            overlay={(
              <EvaluationMenu
                actions={actionsN2}
                handleClick={onN1ChangeStatus}
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
            dataSource={getUsersApprobationList(approbations)}
            renderItem={approbation => {
              const N1approbation = getEvaluationFromValue(actionsN1, approbation.value);
              return (
                <List.Item key={approbation.n1}>
                  {approbation.n1} : {N1approbation
                    ? (N1approbation.selectedLabel || N1approbation.label)
                    : 'En attente d\'évaluation'}
                </List.Item>
              );
            }}
          />
        </div>
      </Card>
    );
  }

  return (
    <Status userrequestState={state} approbations={approbations} user={user} />
  );
};

const StateToProps = state => ({
  user: {
    group: getUserGroup(state),
    uuid: state.authentication.payload && state.authentication.payload.user.uuid,
  },
});

const DispatchToProps = dispatch =>
  bindActionCreators({
    onChangeStatus: updateState,
    onApproved: updateApproved,
  }, dispatch);

export default connect(StateToProps, DispatchToProps)(RequestStatus);

