import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Button, Icon } from 'antd';

import styles from 'components/Drawer/Drawer.module.scss';

class Drawer extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    visible: PropTypes.bool,
  };

  static defaultProps = {
    visible: false,
  };

  render () {
    const { visible } = this.props;

    return (
      <div
        className={classnames({
          [styles.drawer]: true,
          [styles['drawer--expanded']]: visible,
          [`drawer__${this.props.id}--expanded`]: visible,
        })}
        id={this.props.id}
      >
        {this.props.children}
        <Button
          className={classnames({
            [styles.collapseButton]: true,
            [styles['collapseButton--visible']]: visible,
          })}
          onClick={this.props.handleVisibilityToggle}
          aria-controls={this.props.id}
          aria-expanded={visible}
        >
          {visible && 'Replier le panneau'}
          <Icon className={styles.collapseIcon} type="double-right" />
        </Button>
      </div>
    );
  }
}

export default Drawer;
