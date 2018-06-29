import React from 'react';
import { Card, Button, message } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Form as ReduxForm, track } from 'react-redux-form';
import { withRouter } from 'react-router-dom';
import moment from 'moment';

import { fetchUserrequest } from 'modules/userrequest';
import { updateConfigValue } from 'modules/appConfig';

import HeaderForm from 'components/Form/HeaderForm';
import FormConfig from 'components/Form/Form.config';
import FormSummary from 'components/Form/FormSummary';

import styles from './Form.module.scss';

const HeaderUserrequest = props => (
  <div className={styles.header}>
    <h1>{FormConfig.title[props.mode]}</h1>
    {props.updated_at &&
      <React.Fragment>
        <p>Demande d'autorisation n°{props.match.params.id}</p>
        <p style={{ fontStyle: 'italic' }}>
        Dernière sauvegarde le {moment(props.updated_at).format('DD/MM/YYYY à HH:mm', 'fr')}
        </p>
      </React.Fragment>
    }
  </div>
);

class FormApp extends React.Component {
  componentDidMount () {
    if (this.props.match.params.id) {
      // If we route on a draft userrequest, load data
      this.props.fetchUserrequest(this.props.match.params.id);
    }
  }

  componentDidUpdate (prevProps) {
    if (prevProps.updated_at !== this.props.updated_at && this.props.id) {
      message.success('Votre demande a bien été sauvegardée !');
      this.props.history.push(`/request/${this.props.id}`);
    }
  }

  previewForm = () => {
    this.props.updateConfigValue('formMode', 'preview');
  }

  editForm = () => {
    this.props.updateConfigValue('formMode', 'edit');
  }

  render () {
    return (
      <div>
        <HeaderForm />
        <HeaderUserrequest {...this.props} />
        {this.props.mode ===  'edit' ?
          <ReduxForm
            model={track('userrequest')}
            onSubmit={this.previewForm}
          >
            {FormConfig.steps.map(step => (
              <Card title={step.title} key={step.title} style={{ marginTop: 16 }}>
                <step.component />
              </Card>
            ))}
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
  updated_at: state.userrequest.updated_at,
  mode: state.appConfig.formMode,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ fetchUserrequest, updateConfigValue }, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FormApp));
