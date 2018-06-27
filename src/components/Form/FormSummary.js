import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { Button, Modal, Alert } from 'antd';
import Summary from 'components/Summary/Summary';
import FormConfig from 'components/Form/Form.config';
import HeaderForm from 'components/Form/HeaderForm';
import { submitData } from 'modules/userrequest';


class FormSummary extends React.Component {
  handleAction = () => {
    this.props.history.push('/manage-request');
  }

  submitForm = () => {
    this.props.submitData(this.props.userrequest);
  }

  // editForm = () => {
  //   this.props.history.push(`/request/${this.props.userrequest.id}/`);
  // }

  render () {
    const { userrequest, form } = this.props;
    return (
      <div>
        <HeaderForm />
        <Summary data={userrequest} />

        {!form.valid && <Alert
          style={{ marginTop: 16 }}
          message={form.error}
          description={FormConfig.confirmation.errorText}
          type="error"
          showIcon
        />}
        <div style={{ margin: '24px 0', textAlign: 'right' }}>
          <Button
            size="large"
            onClick={this.props.editForm}
            style={{ marginRight: 8 }}
          >
            {FormConfig.confirmation.editButton}
          </Button>
          <Button
            type="primary"
            icon="arrow-right"
            size="large"
            onClick={this.submitForm}
            htmlFor="submit"
            loading={form.pending}
          >
            {FormConfig.confirmation.submitButton}
          </Button>
        </div>

        <Modal
          visible={form.submitted}
          title={FormConfig.confirmation.modal.title}
          closable={false}
          footer={[
            <Button key="submit" type="primary" onClick={this.handleAction}>
              {FormConfig.confirmation.modal.action}
            </Button>,
          ]}
        >
          {FormConfig.confirmation.modal.text}
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  userrequest: state.userrequest,
  form: state.forms.userrequest.$form,
});

const mapDispatchToProps = dispatch => bindActionCreators({ submitData }, dispatch);

FormSummary.propTypes = {
  editForm: PropTypes.func.isRequired,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FormSummary));
