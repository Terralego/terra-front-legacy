import React from 'react';
import { Card, Button, message, Spin } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Form as ReduxForm, track } from 'react-redux-form';
import { withRouter } from 'react-router-dom';
import moment from 'moment';

import { fetchUserrequest } from 'modules/userrequestList';
import { resetForm } from 'modules/userrequest';
import { updateConfigValue } from 'modules/appConfig';
import validators from 'components/Form/validators';

import HeaderForm from 'components/Form/HeaderForm';
import FormConfig from 'components/Form/Form.config';
import FormSummary from 'components/Form/FormSummary';
import SubmitFailed from 'components/Form/SubmitFailed';

import styles from './Form.module.scss';

const isDraft = props => props.data && props.data.state === props.draftStatus;
const isNew = (prevProps, props) => !prevProps.data && !props.data && props.id;
const isExisting = (prevProps, props) => props.id && prevProps.data && props.data
  && prevProps.data.updated_at !== props.data.updated_at && prevProps.data.updated_at;
const isDraftLoading = props => props.location.pathname !== '/new-request' && !props.data.updated_at;

const HeaderUserrequest = props => (
  <div className={styles.header}>
    <h1>{FormConfig.title[props.mode]}</h1>
    {props.data && props.data.updated_at &&
      <React.Fragment>
        <p>Demande d'autorisation n°{props.match.params.id}</p>
        <p style={{ fontStyle: 'italic' }}>
        Dernière sauvegarde le {moment(props.data.updated_at).format('DD/MM/YYYY à HH:mm', 'fr')}
        </p>
      </React.Fragment>
    }
  </div>
);

class FormApp extends React.Component {
  componentDidUpdate (prevProps) {
    if (isDraft(this.props)
    && (isNew(prevProps, this.props) || isExisting(prevProps, this.props))) {
      message.success('Votre déclaration a bien été sauvegardée !');
      this.props.history.push(`/manage-request/detail/${this.props.id}`);
    }
  }

  componentWillUnmount () {
    this.props.resetForm({ full: true });
  }

  getFormErrors () {
    const { form: { properties } } = this.props;
    return Array.from(Object.values(properties))
      .map(property => {
        const form = property.$form || property;
        const { model, valid } = form;

        return (!model || valid) ? null : model;
      })
      .filter(a => a);
  }

  previewForm = () => {
    this.props.updateConfigValue('formMode', 'preview');
  }

  editForm = () => {
    this.props.updateConfigValue('formMode', 'edit');
  }

  render () {
    if (this.props.data && isDraftLoading(this.props)) {
      return (
        <React.Fragment>
          <HeaderUserrequest {...this.props} />
          <Spin style={{ margin: '30px auto', width: '100%' }} />
        </React.Fragment>
      );
    }

    const { form: { $form: { submitFailed } } } = this.props;
    const errors = this.getFormErrors();

    return (
      <div>
        <HeaderForm showDraft />
        <HeaderUserrequest {...this.props} />
        {this.props.mode ===  'edit' ?
          <ReduxForm
            model={track('userrequest')}
            onSubmit={this.previewForm}
            validators={validators(this.props)}
          >
            {FormConfig.steps.map(step => (
              <Card title={step.title} key={step.title} style={{ marginTop: 16 }}>
                <step.component />
              </Card>
            ))}
            {submitFailed &&
            <SubmitFailed
              errors={errors}
            />}
            <div style={{ margin: '24px 0', textAlign: 'right' }}>
              <Button size="large" type="primary" htmlType="submit">{FormConfig.confirmation.previewButton}</Button>
            </div>
          </ReduxForm>
        :
          <FormSummary editForm={this.editForm} />
        }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  id: state.userrequest.id,
  mode: state.appConfig.formMode,
  form: state.forms.userrequest,
  draftStatus: state.appConfig.states.DRAFT,
  features: state.userrequest.geojson.features,
  activities: state.userrequest.properties.activities,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ fetchUserrequest, updateConfigValue, resetForm }, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FormApp));
