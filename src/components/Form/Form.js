import React from 'react';
import { Card, Button, message } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Form } from 'react-redux-form';
import { withRouter } from 'react-router-dom';
import moment from 'moment';

import { getUserrequest, clear } from 'modules/userrequest';
import HeaderForm from 'components/Form/HeaderForm';
import FormConfig from 'components/Form/Form.config';

import styles from './Form.module.scss';

class FormApp extends React.Component {
  componentDidMount () {
    if (this.props.match.params.id) {
      // If we route on a draft userrequest, load data
      this.props.getUserrequest(this.props.match.params.id);
    } else {
      // Else, clear fields to get a blank form
      this.props.clear();
    }
  }

  componentDidUpdate (prevProps) {
    if (prevProps.updated_at !== this.props.updated_at && this.props.id) {
      message.success('Votre demande a bien été sauvegardée !');
      this.props.history.push(`/request/${this.props.id}`);
    }
  }

  handleSubmit = () => {
    this.props.history.push('/request-preview');
  }

  render () {
    return (
      <div>
        <HeaderForm />
        <div className={styles.header}>
          {this.props.updated_at ?
            <React.Fragment>
              <h1>Demande d'autorisation n°{this.props.match.params.id}</h1>
              <p style={{ fontStyle: 'italic' }}>
                Dernière sauvegarde le {moment(this.props.updated_at).format('DD/MM/YYYY à HH:mm', 'fr')}
              </p>
            </React.Fragment>
          :
            <h1>Nouvelle demande d'autorisation</h1>
          }
        </div>
        <Form
          model="userrequest"
          onSubmit={userrequest => this.handleSubmit(userrequest)}
        >
          {FormConfig.steps.map(step => (
            <Card title={step.title} key={`step_${step.title}`} style={{ marginTop: 16 }}>
              <step.component />
            </Card>
          ))}

          <div style={{ margin: '24px 0', textAlign: 'right' }}>
            <Button size="large" type="primary" htmlType="submit">{FormConfig.confirmation.previewButton}</Button>
          </div>
        </Form>
      </div>
    );
  }
}

const StateToProps = state => ({
  ...state.userrequest,
});

const DispatchToProps = dispatch =>
  bindActionCreators({ getUserrequest, clear }, dispatch);

export default withRouter(connect(StateToProps, DispatchToProps)(FormApp));
