import React, { Component } from 'react';
import { Button, Row, Col } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import { Form as ReduxForm } from 'react-redux-form';

import { loginUser } from 'modules/authentication';
import Input from 'components/Fields/Input';

import styles from './Login.module.scss';

class FormLogin extends Component {
  constructor (props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit () {
    this.props.loginUser(this.props.login);
  }

  render () {
    const { isAuthenticated, location, form } = this.props;

    return (
      isAuthenticated ?
        <Redirect to={location.state ? location.state.from : '/'} />
        :
        <ReduxForm model="login">
          <Row className={styles.row}>
            <Col span={24} sm={12} className={styles.login}>
              <h2>Se connecter</h2>
              <Input
                model=".email"
                label="Email"
                errorMessages={{ required: 'Veuillez saisir votre email' }}
                required
              />

              <Input
                model=".password"
                type="password"
                label="Mot de passe"
                errorMessages={{ required: 'Veuillez saisir votre mot de passe' }}
                required
              />

              <Button
                type="primary"
                icon="arrow-right"
                className={styles.loginButton}
                onClick={this.handleSubmit}
                loading={form.pending}
              >
                Me connecter
              </Button>
            </Col>
            <Col span={24} sm={12} className={styles.signup}>
              <h2>Créer un compte</h2>
              <p>Vous n'avez pas encore de compte ?</p>

              <Link to="/profile">
                <Button type="default" icon="arrow-right" className={styles.signupButton}>
                  Créer un compte
                </Button>
              </Link>
            </Col>
          </Row>
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
