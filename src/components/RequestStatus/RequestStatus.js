import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Card, Alert, Button } from 'antd';

import { getUserGroup } from 'modules/authentication';
import { updateRequestProperties } from 'modules/userrequest';
import FormConfig from 'components/Form/Form.config';

const Status = ({ state, userGroup }) => <Alert message={state[userGroup]} type={state.type || 'info'} />;

const RequestStatus = props => {
  const { userGroup, status } = props;
  const state = FormConfig.status[status];

  if (!state) {
    return null;
  }

  if (userGroup === 'N1') {
    return (
      <Card title="Évaluation de niv 1">
        <Status state={state} {...props} />
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
        <Status state={state} {...props} />
      </Card>
    );
  }

  return (
    <Status state={state} {...props} />
  );
};

const StateToProps = state => ({
  userGroup: getUserGroup(state),
});

const DispatchToProps = dispatch =>
  bindActionCreators({ updateRequestProperties }, dispatch);

RequestStatus.propTypes = {
  userGroup: PropTypes.string.isRequired,
  status: PropTypes.number.isRequired,
};

export default connect(StateToProps, DispatchToProps)(RequestStatus);

