import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Card, Alert, Button } from 'antd';

import getUserrequestStatus from 'modules/userrequestStatus';
import { getUserGroup } from 'modules/authentication';
import { updateRequestProperties } from 'modules/userrequest';

export const Status = ({ state, approbations, userGroup }) => {
  if (state) {
    const status = getUserrequestStatus(state, approbations, userGroup);
    return <Alert message={status.text} type={status.type || 'info'} />;
  }
  return null;
};

const RequestStatus = props => {
  const { userGroup } = props;

  if (userGroup === 'N1') {
    return (
      <Card title="Évaluation de niv 1">
        <Status {...props} />
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
        <Status {...props} />
      </Card>
    );
  }

  return (
    <Status {...props} />
  );
};

const StateToProps = state => ({
  userGroup: getUserGroup(state),
});

const DispatchToProps = dispatch =>
  bindActionCreators({ updateRequestProperties }, dispatch);

RequestStatus.propTypes = {
  userGroup: PropTypes.string.isRequired,
  state: PropTypes.number.isRequired,
};

export default connect(StateToProps, DispatchToProps)(RequestStatus);

