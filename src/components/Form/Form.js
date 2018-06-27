import React from 'react';
import { Card, Button, message } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Form as ReduxForm, track } from 'react-redux-form';
import { withRouter } from 'react-router-dom';
import moment from 'moment';

import { fetchUserrequest, saveDraft } from 'modules/userrequest';

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
  state = {
    mode: 'edit', // edit or preview
  };

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
    this.setState({ mode: 'preview' });
  }

  editForm = () => {
    this.setState({ mode: 'edit' });
  }

  render () {
    const { mode } = this.state;

    return (
      <div>
        <HeaderForm />
        <HeaderUserrequest {...this.props} mode={mode} />
        {mode ===  'edit' ?
          <ReduxForm
            model={track('userrequest')}
            onSubmit={this.previewForm}
          >
            {FormConfig.steps.map(step => (
              <Card title={step.title} key={`step_${step.title}`} style={{ marginTop: 16 }}>
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
  ...state.userrequest,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ fetchUserrequest, saveDraft }, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FormApp));
