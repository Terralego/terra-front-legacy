import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Icon, Col, Row } from 'antd';
import { withRouter, Link } from 'react-router-dom';

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

  render () {
    const { loadingSaveDraft } = this.state;
    const { location, form, showSubmit, showDraft } = this.props;

    return (
      <header className={styles.header}>
        <Row gutter={16} type="flex" justify="space-between">
          <Col span={12}>
            <Link to={location.state ? location.state.from : '/manage-request'} onClick={this.props.resetForm}>
              <Button type="primary">
                <Icon type="left" />
                {FormConfig.confirmation.backButton}
              </Button>
            </Link>
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
