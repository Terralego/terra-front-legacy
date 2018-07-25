import React from 'react';
import { Row, Col } from 'antd';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Signin from 'components/Signin/Signin';
import Signup from 'components/Signup/Signup';

import styles from './Login.module.scss';

const Login = props => {
  const { isAuthenticated, location } = props;
  console.log(location);
  return (
    isAuthenticated ?
      <Redirect to={location.state ? location.state.from : '/manage-request'} />
      :
      <Row className={styles.row} gutter={24}>
        <Col span={24} sm={{ span: 10, offset: 1 }} className={styles.login}>
          <Signin />
        </Col>
        <Col span={24} sm={{ span: 1, offset: 1 }} className={styles.separator} />
        <Col span={24} sm={{ span: 10 }} className={styles.signup}>
          <Signup />
        </Col>
      </Row>
  );
};

const mapStateToProps = state => ({
  login: state.login,
  form: state.forms.login.$form,
});

export default connect(mapStateToProps, null)(Login);
