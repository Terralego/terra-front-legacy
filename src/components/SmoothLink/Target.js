import React from 'react';
import PropTypes from 'prop-types';

import { createRef } from './refs';

export class SmoothLinkTarget extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    as: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  };

  static defaultProps = {
    as: 'div',
  };

  container = createRef(this.props.name);

  render () {
    const { as: As, name, children } = this.props;
    const { container } = this;

    return (
      <As
        ref={container}
        id={name}
      >
        {children}
      </As>
    );
  }
}

export default SmoothLinkTarget;
