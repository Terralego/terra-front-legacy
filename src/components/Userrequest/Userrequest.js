import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Redirect, withRouter } from 'react-router-dom';
import { Spin, Row, Col, Card } from 'antd';

import { fetchUserrequest } from 'modules/userrequestList';
import { getUserGroup } from 'modules/authentication';
import Summary from 'components/Summary/Summary';
import RequestStatus from 'components/RequestStatus/RequestStatus';
import Comments from 'components/Comments/Comments';

const DRAFT_STATUS = 100;

class Userrequest extends React.Component {
  componentDidMount () {
    if (!this.props.data && !this.props.loading) {
      this.props.fetchUserrequest(this.props.match.params.id);
    }
  }

  render () {
    const { data } = this.props;
    if (data) {
      if (data.error && data.error.status === 404) {
        return <Redirect to="/manage-request" from={this.props.location.pathname} />;
      }
      // If userrequest is in draft status
      // and user group is user, redirect to editabled request
      if (data.state === DRAFT_STATUS
        && this.props.userGroup === 'user') {
        return (
          <Redirect
            to={{ pathname: `/request/${data.id}`, state: { from: this.props.location.pathname } }}
            from={this.props.location.pathname}
          />
        );
      }
    }
    return (
      <Row gutter={24} style={{ paddingBottom: 24 }}>
        <Col span={24} lg={14}>
          {data ?
            <Summary data={data} />
          : <Spin style={{ margin: '30px auto', width: '100%' }} />}
        </Col>

        <Col span={24} lg={10}>
          {data && <RequestStatus userrequest={data} />}
          <Card title="Échanges" style={{ marginTop: 24 }}>
            <Comments userrequestId={this.props.match.params.id} />
          </Card>
        </Col>
      </Row>
    );
  }
}

const StateToProps = (state, ownProps) => ({
  // TODO: use Reselect for increase performances
  data: state.userrequestList.items[ownProps.match.params.id],
  loading: state.userrequestList.loading,
  userGroup: getUserGroup(state),
});

const DispatchToProps = dispatch =>
  bindActionCreators({ fetchUserrequest }, dispatch);

export default withRouter(connect(StateToProps, DispatchToProps)(Userrequest));
