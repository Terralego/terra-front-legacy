import React, { Component } from 'react';
import { Button } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Form as ReduxForm } from 'react-redux-form';

import { loginUser } from 'modules/authentication';
import Input from 'components/Fields/Input';

import styles from './Signin.module.scss';

class FormLogin extends Component {
  constructor (props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit () {
    this.props.loginUser(this.props.login);
  }

  render () {
    const { form } = this.props;

    return (
      <ReduxForm model="login" onSubmit={this.handleSubmit}>
        <h2>Se connecter</h2>
        <Input
          autoFocus
          model=".email"
          label="Email"
          errorMessages={{ required: { message: 'Please provide an email' } }}
        />

        <Input
          model=".password"
          type="password"
          label="Mot de passe"
          errorMessages={{ required: { message: 'Please provide a password' } }}
          required
        />

        <Button
          type="primary"
          htmlType="submit"
          icon="arrow-right"
          className={styles.button}
          loading={form.pending}
        >
          Me connecter
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
  bindActionCreators({ loginUser }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(FormLogin);
