import React from 'react';
import { withRouter } from 'react-router-dom';

/**
 * ScrollToTop automatically scroll window to top each time the document
 * location is changed.
 *
 * @class ScrollToTop
 * @extends {React.Component}
 */
class ScrollToTop extends React.Component {
  componentDidUpdate (prevProps) {
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
  }

  render () {
    return this.props.children || null;
  }
}

export default withRouter(ScrollToTop);
