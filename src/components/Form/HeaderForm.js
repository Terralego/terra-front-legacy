import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Icon, Col, Row, Modal } from 'antd';
import { withRouter, Redirect } from 'react-router-dom';
import { translate } from 'react-i18next';

import { saveDraft, submitData, resetForm } from 'modules/userrequest';
import FormConfig from 'components/Form/Form.config';

import styles from './HeaderForm.module.scss';

class HeaderForm extends React.Component {
  submitForm = () => {
    this.props.submitData(this.props.userrequest);
  }

  saveDraft (e) {
    this.props.saveDraft(this.props.userrequest);
    e.preventDefault();
  }

  print = () => {
    window && window.print();
  }

  showConfirmationReturn = () => {
    const { location: { state }, form, history, t } = this.props;
    const pushHistory = () => history.push(state ? state.from : '/manage-request');
    if (!form.touched || form.submitted) {
      pushHistory();
    } else {
      Modal.confirm({
        title: t('Your form isn\'t saved yet. If you go back you will lost all data. Are you sure?'),
        okText: t('Yes'),
        okType: 'danger',
        cancelText: t('No'),
        onOk () {
          pushHistory();
        },
      });
    }
  }

  render () {
    const {
      form,
      showSubmit,
      showDraft,
      match: { params: { id: pathId } },
      userrequest: { isSaving, id, redirection },
    } = this.props;

    const shouldRedirect = redirection && pathId !== id;

    if (shouldRedirect) {
      return <Redirect to={redirection} />;
    }

    return (
      <header className={styles.header}>
        <Row gutter={16} type="flex" justify="space-between">
          <Col span={12}>
            <Button onClick={this.showConfirmationReturn} type="primary">
              <Icon type="left" />
              {FormConfig.confirmation.backButton}
            </Button>
          </Col>
          { (showDraft || showSubmit) ? (
            <Col>
              {showDraft &&
                <Button
                  type="primary-dark"
                  htmlType="button"
                  onClick={e => this.saveDraft(e)}
                  loading={isSaving}
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
          ) : (
            <Button
              type="primary-dark"
              onClick={this.print}
              icon="printer"
              style={{ marginLeft: 12 }}
            >
              {FormConfig.confirmation.printButton}
            </Button>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(translate('headerTranslations')(HeaderForm)));
