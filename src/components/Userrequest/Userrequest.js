import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Redirect, withRouter } from 'react-router-dom';
import { Spin, Row, Col, Card } from 'antd';

import { fetchUserrequest } from 'modules/userrequestList';
import { openDraft, readUserrequest, resetForm } from 'modules/userrequest';

import withAuthentication from 'hoc/authentication';

import Summary from 'components/Summary/Summary';
import RequestStatus from 'components/RequestStatus/RequestStatus';
import Comments from 'components/Comments/Comments';
import Form from 'components/Form/Form';

import styles from './Userrequest.module.scss';

class Userrequest extends React.Component {
  componentDidMount () {
    const { data, match: { params: { id } } } = this.props;

    // Set a "read" flag on userrequest
    this.props.readUserrequest(id);

    if (data) {
      return this.props.openDraft(data);
    }

    this.props.resetForm();
    return this.props.fetchUserrequest(id);
  }

  componentWillUnmount () {
    this.props.resetForm({ full: true });
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
      if (data.state === this.props.draftStatus && this.props.isUser) {
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
  draftStatus: state.appConfig.states.DRAFT,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({
    fetchUserrequest,
    openDraft,
    readUserrequest,
    resetForm,
  }, dispatch);

export default withRouter(withAuthentication(connect(
  mapStateToProps,
  mapDispatchToProps,
)(Userrequest)));
