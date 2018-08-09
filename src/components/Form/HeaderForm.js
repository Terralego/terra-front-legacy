import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Icon, Col, Row, Modal } from 'antd';
import { withRouter } from 'react-router-dom';

import { saveDraft, submitData, resetForm } from 'modules/userrequest';
import FormConfig from 'components/Form/Form.config';

import styles from './HeaderForm.module.scss';

class HeaderForm extends React.Component {
  state = {
    loadingSaveDraft: false,
  }

  submitForm = () => {
    this.props.submitData(this.props.userrequest);
  }

  saveDraft (e) {
    this.setState({ loadingSaveDraft: true });
    this.props.saveDraft(this.props.userrequest);
    e.preventDefault();
  }

  showConfirmationReturn = () => {
    const { location: { state }, form, history } = this.props;
    const pushHistory = () => history.push(state ? state.from : '/manage-request');
    if (!form.touched && !form.submitted) {
      pushHistory();
    } else {
      Modal.confirm({
        title: `Are you sure you want to go to
        ${state ? state.from : '/manage-request'}?`,
        okText: 'Yes',
        okType: 'danger',
        cancelText: 'No',
        onOk () {
          pushHistory();
        },
      });
    }
  }

  render () {
    const { loadingSaveDraft } = this.state;
    const { form, showSubmit, showDraft } = this.props;

    return (
      <header className={styles.header}>
        <Row gutter={16} type="flex" justify="space-between">
          <Col span={12}>
            <Button onClick={this.showConfirmationReturn} type="primary">
              <Icon type="left" />
              {FormConfig.confirmation.backButton}
            </Button>
          </Col>
          { (showDraft || showSubmit) && (
            <Col>
              {showDraft &&
                <Button
                  type="primary-dark"
                  htmlType="button"
                  onClick={e => this.saveDraft(e)}
                  loading={loadingSaveDraft}
                  icon="save"
                >
                  {FormConfig.confirmation.draftButton}
                </Button>
              }
              {showSubmit &&
                <Button
                  type="primary-dark"
                  onClick={this.submitForm}
                  icon="arrow-right"
                  style={{ marginLeft: 12 }}
                  loading={form.pending}
                >
                  {FormConfig.confirmation.submitButton}
                </Button>
              }
            </Col>
          )}
        </Row>
      </header>
    );
  }
}

HeaderForm.propTypes = {
  showSubmit: PropTypes.bool,
};

HeaderForm.defaultProps = {
  showSubmit: false,
};

const mapStateToProps = state => ({
  userrequest: state.userrequest,
  form: state.forms.userrequest.$form,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ saveDraft, submitData, resetForm }, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HeaderForm));
