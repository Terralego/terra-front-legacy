import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Col, Row } from 'antd';
import { Link } from 'react-router-dom';
import FormConfig from 'components/Form/Form.config';

import styles from './HeaderForm.module.scss';

export default function HeaderForm ({ showSubmit }) {
  return (
    <header className={styles.header}>
      <Row gutter={16} type="flex" justify="space-between">
        <Col span={12}>
          <Link to="">Retour</Link>
        </Col>
        <Col>
          <Link to="">
            <Button type="secondary" htmlType="submit">
              <Icon type="save" />{FormConfig.confirmation.dratButton}
            </Button>
          </Link>
          {showSubmit &&
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

HeaderForm.propTypes = {
  showSubmit: PropTypes.bool,
};

HeaderForm.defaultProps = {
  showSubmit: false,
};
