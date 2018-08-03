import React from 'react';
import { connect } from 'react-redux';
import { Icon, Card, Dropdown, Button, Menu, List } from 'antd';
import classnames from 'classnames';

import Status from 'components/RequestStatus/Status';
import { getUserGroup } from 'modules/authentication';
import { updateStateAndApprobation } from 'modules/userrequestList';
import { getReviewer } from 'helpers/userrequestHelpers';

import './RequestStatus.scss';

const actionsN1 = [
  { label: 'En cours de traitement', icon: 'pause', approbation: 0, state: 200 },
  { label: 'En attente d\'information du demandeur', icon: 'pause', approbation: 1, state: 200 },
  { label: 'Approuver', selectedLabel: 'Approuvée', icon: 'check', approbation: 2 },
  { label: 'Refuser', selectedLabel: 'Refusée', icon: 'close', approbation: -1 },
];

const actionsN2 = [
  { label: 'En attente', icon: 'pause', state: 200 },
  { label: 'En attente d\'information du demandeur', icon: 'pause', approbation: 1, state: 200 },
  { label: 'Approuver', icon: 'check', state: 300 },
  { label: 'Refuser', icon: 'close', state: -1 },
];

/**
 * getEvaluationFromValue
 *
 * @param {array} options - array of evaluations options
 * @param {number} value - selected option
 * @return {object} object of current selected option
 */
const getEvaluationFromValue = (options, value) => (
  options.find(option => option.state === value || option.approbation === value)
);

/**
 * getUsersApprobationList
 * Return an array of approbation for all user exept current N2
 *
 * @param {object} approbations - array of approbations
 * @param {object} user - current user
 * @return {array} array of approbations by N1 identifier
 */
const getUsersApprobationList = (approbations, user) => {
  if (!approbations) {
    return [];
  }
  return Object.keys(approbations)
    .filter(uuid => uuid !== user.uuid)
    .map(uuid => ({ n1: uuid, value: approbations[uuid] }));
};

const EvaluationMenu = ({ actions, handleClick }) => (
  <Menu className="dropdownMenu">
    {actions.map(action => (
      <Menu.Item
        className={classnames('dropdownItem', [action.icon])}
        key={action.approbation}
        onClick={() => handleClick(action)}
        style={{ width: '100%' }}
      >
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
 * @param {void} updateApprobationOrState - change userrequest state (N2) or approbation (N1)
 * @param {object} reviewers list of reviewers (N1), by uuid as keys
 */
class RequestStatus extends React.Component {
  state = {
    menuVisible: false,
    loading: false,
  };

  componentWillReceiveProps () {
    this.setState({
      menuVisible: false,
      loading: false,
    });
  }

  handleMenuClick (event, userrequest, user) {
    this.setState({ menuVisible: false, loading: true });
    this.props.updateApprobationOrState(event, userrequest, user);
  }

  handleVisibleChange = flag => {
    this.setState({ menuVisible: flag });
  }

  render () {
    const { userrequest, user } = this.props;
    const { menuVisible, loading } = this.state;

    if (!user) {
      return null;
    }
    const { state, reviewers, expiry } = userrequest;
    const { approbations } = userrequest.properties;

    // If user already give evaluation, get the id, either set 0 (= PENDING)
    const selfEvaluationId = approbations[user.uuid] || 0;
    const selfEvaluation = getEvaluationFromValue([...actionsN1, ...actionsN2], selfEvaluationId);
    if (user.group === 'N1') {
      return (
        <Card title="Évaluation de niv 1">
          <Status
            userrequestState={state}
            approbations={approbations}
            user={user}
            userrequestExpiry={expiry}
          />
          <div className="statusActions">
            <p>Votre évaluation :</p>
            <Dropdown
              overlay={(
                <EvaluationMenu
                  actions={actionsN1}
                  handleClick={e => this.handleMenuClick(e, userrequest, user)}
                />
              )}
              trigger={['click']}
              onVisibleChange={this.handleVisibleChange}
              visible={menuVisible}
            >
              <Button
                className={classnames('actionsButton', [selfEvaluation.icon])}
                icon={selfEvaluation.icon}
                loading={loading}
              >
                <span className="actionsButtonLabel">
                  {selfEvaluation.selectedLabel || selfEvaluation.label}
                </span>
                <Icon type="down" />
              </Button>
            </Dropdown>
          </div>
        </Card>
      );
    }

    if (user.group === 'N2') {
      return (
        <Card title="Évaluation de niv 2">
          <div styles={{ textAlign: 'center' }}>
            <p>Status de la déclaration :</p>
            <Dropdown
              overlay={(
                <EvaluationMenu
                  actions={actionsN2}
                  handleClick={e => this.handleMenuClick(e, userrequest, user)}
                />
              )}
              trigger={['click']}
              onVisibleChange={this.handleVisibleChange}
              visible={menuVisible}
            >
              <Button
                icon={selfEvaluation.icon}
                className={classnames('actionsButton', [selfEvaluation.icon])}
                loading={loading}
              >
                <span className="actionsButtonLabel">
                  {selfEvaluation.selectedLabel || selfEvaluation.label}
                </span>
                <Icon type="down" />
              </Button>
            </Dropdown>

            <List
              size="small"
              dataSource={getUsersApprobationList(approbations, user)}
              renderItem={approbation => {
                const onfEvaluation = getEvaluationFromValue(
                  [...actionsN1, ...actionsN2],
                  approbation.value,
                );
                return (
                  <List.Item key={approbation.n1}>
                    {getReviewer(reviewers, approbation.n1).email} : {onfEvaluation
                      ? (onfEvaluation.selectedLabel || onfEvaluation.label)
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
      <Status
        userrequestState={state}
        approbations={approbations}
        user={user}
        userrequestExpiry={expiry}
      />
    );
  }
}

const mapStateToProps = state => ({
  user: {
    group: getUserGroup(state),
    uuid: state.authentication.payload && state.authentication.payload.user.uuid,
  },
});

const mapDispatchToProps = dispatch => ({
  updateApprobationOrState:
    (e, userrequest, user) => dispatch(updateStateAndApprobation(userrequest, e, user.uuid)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RequestStatus);

