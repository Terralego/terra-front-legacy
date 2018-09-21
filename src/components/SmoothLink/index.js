import React from 'react';
import PropTypes from 'prop-types';

import { getRef } from './refs';

export class SmoothLink extends React.Component {
  static propTypes = {
    target: PropTypes.string,
    margin: PropTypes.number,
  };

  static defaultProps = {
    margin: 0,
  };

  scrollTo = e => {
    e.preventDefault();
    const target = getRef(this.props.target);

    if (!target) return;

    const { margin } = this.props;
    const { scrollY, scroll } = global;
    const { top: targetTop } = target.getBoundingClientRect();

    const top = (scrollY + targetTop) - margin;

    scroll({ top, behavior: 'smooth' });
  }

  render () {
    const { children, target } = this.props;

    return (
      <a
        href={`#${target}`}
        onClick={this.scrollTo}
      >
        {children}
      </a>
    );
  }
}

export default SmoothLink;
