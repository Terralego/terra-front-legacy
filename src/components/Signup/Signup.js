import React, { Component } from 'react';
import { Button, Alert } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Form as ReduxForm } from 'react-redux-form';

import { signUp } from 'modules/account';
import Input from 'components/Fields/Input';

import styles from './Signup.module.scss';

const SuccessMessage = () => (
  <Alert
    message="Votre inscription a bien été prise en compte"
    description="Merci de cliquer sur le lien dans le mail qui vient de vous être envoyé."
    type="info"
  />
);

class FormLogin extends Component {
  handleSubmit = () => {
    this.props.signUp(this.props.account.email);
  }

  render () {
    const { form, account } = this.props;

    return (
      <div>
        <h2>Créer un compte</h2>

        {account.emailSent &&
          <SuccessMessage />
        }

        {!account.emailSent &&
          <ReduxForm model="account">
            <p>Vous n'avez pas encore de compte ?</p>
            <Input
              model=".email"
              id="signupEmail"
              label="Saisissez votre adresse email"
              errorMessages={{ required: { message: 'Veuillez saisir une adresse email' } }}
            />

            {account.signupError
              && <Alert message={account.signupError} type="error" />
            }
            <Button
              type="primary"
              icon="arrow-right"
              className={styles.button}
              loading={form.pending}
              onClick={this.handleSubmit}
            >
              Créer un compte
            </Button>
          </ReduxForm>
        }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  account: state.account,
  form: state.forms.account.$form,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ signUp }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(FormLogin);
