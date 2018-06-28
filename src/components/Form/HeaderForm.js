import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Icon, Col, Row } from 'antd';
import { withRouter } from 'react-router-dom';

import { saveDraft } from 'modules/userrequest';
import FormConfig from 'components/Form/Form.config';

import styles from './HeaderForm.module.scss';

class HeaderForm extends React.Component {
  saveDraft = e => {
    this.props.saveDraft(this.props.userrequest);
    e.preventDefault();
  }

  render () {
    return (
      <header className={styles.header}>
        <Row gutter={16} type="flex" justify="space-between">
          <Col span={12}>
            <Button type="inverse" onClick={this.props.history.goBack}>
              <Icon type="left" />
              {FormConfig.confirmation.backButton}
            </Button>
          </Col>
          <Col>
            <Button type="primary-dark" htmlType="button" onClick={this.saveDraft}>
              <Icon type="save" />{FormConfig.confirmation.draftButton}
            </Button>
            {this.props.showSubmit &&
            <Button type="primary-dark" htmlType="submit">
              <Icon type="check-circle-o" />{FormConfig.confirmation.submitButton}
            </Button>
            }
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

const mapStateToProps = state => ({
  userrequest: state.userrequest,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ saveDraft }, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HeaderForm));
