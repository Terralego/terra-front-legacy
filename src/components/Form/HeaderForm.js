import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Icon, Modal } from 'antd';
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
        className: styles['flip-buttons'],
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
        <Button
          className={styles.back}
          onClick={this.showConfirmationReturn}
          type="primary"
        >
          <Icon type="left" />
          {FormConfig.confirmation.backButton}
        </Button>
        {showDraft
        ?
          <Button
            type="primary-dark"
            htmlType="button"
            onClick={e => this.saveDraft(e)}
            loading={isSaving === 'draft'}
            icon="save"
          >
            {FormConfig.confirmation.draftButton}
          </Button>
         :
          <Button
            type="primary-dark"
            onClick={this.print}
            icon="printer"
            style={{ marginLeft: 12 }}
          >
            {FormConfig.confirmation.printButton}
          </Button>
        }
        {this.props.children}
      </header>
    );
  }
}

const mapStateToProps = state => ({
  userrequest: state.userrequest,
  form: state.forms.userrequest.$form,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ saveDraft, submitData, resetForm }, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(translate('headerTranslations')(HeaderForm)));
