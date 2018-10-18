import React from 'react';
import PropTypes from 'prop-types';
import settings from 'front-settings';

export class Paginate extends React.Component {
  static propTypes = {
    items: PropTypes.array,
    page: PropTypes.number,
    perPage: PropTypes.number,
  };

  static defaultProps = {
    items: [],
    page: 1,
    perPage: settings.PAGE_SIZE || 50,
  };

  render () {
    const { children, items, page, perPage } = this.props;
    const from = (page - 1) * perPage;
    const to = from + perPage;
    const pagedItems = [...items].splice(from, to).filter(a => a);

    return children(pagedItems);
  }
}

export default Paginate;
