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
        <Row className={styles.row} gutter={24}>
          <Col span={24} sm={{ span: 10, offset: 1 }} className={styles.login}>
            <ReduxForm model="login">
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
            </ReduxForm>
          </Col>
          <Col span={24} sm={{ span: 1, offset: 1 }} className={styles.separator} />
          <Col span={24} sm={{ span: 10 }} className={styles.signup}>
            <ReduxForm model="signup">
              <h2>Créer un compte</h2>
              <p>Vous n'avez pas encore de compte ?</p>

              <Link to="/profile">
                <Input
                  model=".signupEmail"
                  label="Saisissez votre adresse email"
                  errorMessages={{ required: 'Veuillez saisir votre email' }}
                  required
                />
                <Button
                  type="primary"
                  icon="arrow-right"
                  className={styles.signupButton}
                >
                Créer un compte
                </Button>
              </Link>
            </ReduxForm>
          </Col>
        </Row>
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
