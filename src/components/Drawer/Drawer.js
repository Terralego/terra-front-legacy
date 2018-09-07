import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Button, Icon } from 'antd';

import styles from 'components/Drawer/Drawer.module.scss';

const Drawer = ({ visible, id, children, handleVisibilityToggle }) => (
  <div
    className={classnames({
      [styles.drawer]: true,
      [styles['drawer--expanded']]: visible,
      [`drawer__${id}--expanded`]: visible,
    })}
    id={id}
  >
    {children}
    {handleVisibilityToggle &&
      <Button
        className={classnames({
          [styles.collapseButton]: true,
          [styles['collapseButton--visible']]: visible,
        })}
        onClick={handleVisibilityToggle}
        aria-controls={id}
        aria-expanded={visible}
      >
        {visible && 'Replier le panneau'}
        <Icon className={styles.collapseIcon} type="double-right" />
      </Button>}
  </div>
);

Drawer.propTypes = {
  id: PropTypes.string.isRequired,
  visible: PropTypes.bool,
  handleVisibilityToggle: PropTypes.func,
};

Drawer.defaultProps = {
  visible: true,
};

export default Drawer;
