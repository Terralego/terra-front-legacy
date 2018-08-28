import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Button, Icon } from 'antd';

import styles from 'components/Drawer/Drawer.module.scss';

class Drawer extends React.Component {
  state = {
    visible: false,
  }

  drawerToggle = () => {
    this.setState({ visible: !this.state.visible });
  }

  render () {
    return (
      <div
        className={classnames({
          [styles.drawer]: true,
          [styles['drawer--expanded']]: this.state.visible,
          [`drawer__${this.props.id}--expanded`]: this.state.visible,
        })}
        id={this.props.id}
      >
        {this.props.children}
        <Button
          className={classnames({
            [styles.collapseButton]: true,
            [styles['collapseButton--visible']]: this.state.visible,
          })}
          onClick={this.drawerToggle}
          aria-controls={this.props.id}
          aria-expanded={this.state.visible}
        >
          <Icon className={styles.collapseIcon} type="double-right" />
        </Button>
      </div>
    );
  }
}

Drawer.propTypes = {
  id: PropTypes.string.isRequired,
};

export default Drawer;
