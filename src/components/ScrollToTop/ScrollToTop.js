import React from 'react';

/**
 * ScrollToTop automatically scroll window to top each time the document
 * location is changed.
 *
 * @class ScrollToTop
 * @extends {React.Component}
 */
class ScrollToTop extends React.Component {
  componentWillMount () {
    window.scrollTo(0, 0);
  }

  render () {
    return this.props.children || null;
  }
}

export default ScrollToTop;
