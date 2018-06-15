import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Icon, Col, Row } from 'antd';
import { Link, withRouter } from 'react-router-dom';

import { saveDraft } from 'modules/userrequest';
import FormConfig from 'components/Form/Form.config';

import styles from './HeaderForm.module.scss';

class HeaderForm extends React.Component {
  saveDraft (e) {
    this.props.saveDraft(this.props.userrequest);
    e.preventDefault();
  }

  render () {
    return (
      <header className={styles.header}>
        <Row gutter={16} type="flex" justify="space-between">
          <Col span={12}>
            <Link to="">Retour</Link>
          </Col>
          <Col>
            <Link to="">
              <Button type="secondary" htmlType="button" onClick={e => this.saveDraft(e)}>
                <Icon type="save" />{FormConfig.confirmation.dratButton}
              </Button>
            </Link>
            {this.props.showSubmit &&
            <Link to="" style={{ marginLeft: 12 }}>
              <Button type="primary" htmlType="submit">
                <Icon type="check-circle-o" />{FormConfig.confirmation.submitButton}
              </Button>
            </Link>}
          </Col>
        </Row>
      </header>
    );
  }
}

HeaderForm.propTypes = {
  showSubmit: PropTypes.bool,
};

HeaderForm.defaultProps = {
  showSubmit: false,
};

const StateToProps = state => ({
  userrequest: state.userrequest,
});

const DispatchToProps = dispatch =>
  bindActionCreators({ saveDraft }, dispatch);

export default withRouter(connect(StateToProps, DispatchToProps)(HeaderForm));
