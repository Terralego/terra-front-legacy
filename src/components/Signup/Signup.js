import React, { Component } from 'react';
import { Button } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Form as ReduxForm } from 'react-redux-form';

import { signUp } from 'modules/signup';
import Input from 'components/Fields/Input';

import styles from './Signup.module.scss';

class FormLogin extends Component {
  handleSubmit = () => {
    this.props.signUp(this.props.login);
  }

  render () {
    return (
      <ReduxForm model="signup">
        <h2>Créer un compte</h2>
        <p>Vous n'avez pas encore de compte ?</p>
        <Input
          model=".signupEmail"
          label="Saisissez votre adresse email"
          errorMessages={{ required: { message: 'Veuillez saisir une adresse email' } }}
        />
        <Button
          type="primary"
          icon="arrow-right"
          className={styles.button}
        >
          Créer un compte
        </Button>
      </ReduxForm>
    );
  }
}

const mapStateToProps = state => ({
  login: state.login,
  form: state.forms.login.$form,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ signUp }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(FormLogin);
