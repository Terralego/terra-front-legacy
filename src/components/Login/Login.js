import React from 'react';
import { Row, Col } from 'antd';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Signin from 'components/Signin/Signin';
import Signup from 'components/Signup/Signup';

import styles from './Login.module.scss';

const Login = props => {
  const { isAuthenticated, location, userrequestList } = props;
  let redirection = <Redirect to={location.state ? location.state.from : '/manage-request'} />;
  if (!userrequestList) {
    redirection = <Redirect to={location.state ? location.state.from : '/'} />;
  }
  return (
    isAuthenticated ?
      redirection
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
  userrequestList: state.userrequestList,
});

export default connect(mapStateToProps, null)(Login);
