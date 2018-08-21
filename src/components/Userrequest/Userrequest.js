import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Redirect, withRouter } from 'react-router-dom';
import { Spin, Row, Col, Card } from 'antd';

import { fetchUserrequest } from 'modules/userrequestList';
import { openDraft, readUserrequest } from 'modules/userrequest';

import withAuthentication from 'hoc/authentication';

import Summary from 'components/Summary/Summary';
import RequestStatus from 'components/RequestStatus/RequestStatus';
import Comments from 'components/Comments/Comments';
import Form from 'components/Form/Form';

import styles from './Userrequest.module.scss';

const DRAFT_STATUS = 100;

class Userrequest extends React.Component {
  componentDidMount () {
    if (this.props.data) this.props.readUserrequest(this.props.data.id);
    else this.props.readUserrequest(this.props.match.params.id);
    if (this.props.data && this.props.data.state === DRAFT_STATUS) {
      this.props.openDraft(this.props.data);
    }
    if (!this.props.data && !this.props.loading) {
      this.props.fetchUserrequest(this.props.match.params.id);
    }
  }

  render () {
    const { data, loading } = this.props;
    if (loading) {
      return <Spin style={{ margin: '30px auto', width: '100%' }} />;
    }
    if (data) {
      if (data.error && data.error.status === 404) {
        return <Redirect to="/manage-request" from={this.props.location.pathname} />;
      }
      // If userrequest is in draft status
      // and user group is user, redirect to editable request
      if (data.state === DRAFT_STATUS
        && this.props.isUser) {
        return (
          <Form {...this.props} />
        );
      }
    }
    return (
      <Row gutter={24} className={styles.userrequest}>
        <Col span={24} lg={14} className={styles.userrequest_summary}>
          {data ?
            <Summary data={data} />
          : <Spin style={{ margin: '30px auto', width: '100%' }} />}
        </Col>

        <Col span={24} lg={10} className={styles.userrequest_comments}>
          {data && <RequestStatus userrequest={data} />}
          <Card title="Échanges">
            <Comments userrequestId={this.props.match.params.id} />
          </Card>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  data: state.userrequestList[ownProps.match.params.id],
  loading: state.userrequestList.loading,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ fetchUserrequest, openDraft, readUserrequest }, dispatch);

export default withRouter(withAuthentication(connect(
  mapStateToProps,
  mapDispatchToProps,
)(Userrequest)));
