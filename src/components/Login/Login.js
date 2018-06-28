import React, { Component } from 'react';
import { Form, Button, Input, Row, Col } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';

import { loginUser } from 'modules/authentication';

import styles from './Login.module.scss';

const FormItem = Form.Item;

class Login extends Component {
  constructor (props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (event) {
    event.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.loginUser(values);
      }
    });
  }

  render () {
    const { getFieldDecorator } = this.props.form;
    const { isAuthenticated, location } = this.props;

    return (
      isAuthenticated ?
        <Redirect to={location.state ? location.state.from : '/'} />
        :
        <Form onSubmit={this.handleSubmit}>
          <Row className={styles.row}>
            <Col span={24} sm={12} className={styles.login}>
              <h2>Se connecter</h2>
              <FormItem label="Email" >
                {getFieldDecorator('email', {
                  rules: [{ required: true, message: 'Veuillez saisir un titre' }],
                })(<Input />)}
              </FormItem>

              <FormItem label="Password">
                {getFieldDecorator('password', {
                })(<Input type="password" />)}
              </FormItem>

              <Button type="primary" htmlType="submit" icon="arrow-right" className={styles.loginButton}>
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
        </Form>
    );
  }
}

const FormLogin = Form.create()(Login);

const mapDispatchToProps = dispatch =>
  bindActionCreators({ loginUser }, dispatch);

export default connect(null, mapDispatchToProps)(FormLogin);
