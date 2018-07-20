import React from 'react';
import { withRouter } from 'react-router-dom';
import { Pagination as AntPagination } from 'antd';
import queryString from 'query-string';
import settings from 'front-settings';

import styles from './UserrequestList.module.scss';

class Pagination extends React.Component {
  /**
   * changeHistory add query string parameter in url
   * duplicate function with Search component : see https://github.com/supasate/connected-react-router
   * to implement history change in actions / reducers
   * @param {object} query : couple(s) of key / value parameter(s)
   * @memberof Pagination
   */
  changeHistory = query => this.props.history.push(`/manage-request/?${
    queryString.stringify({
      ...queryString.parse(this.props.location.search),
      ...query,
    })
  }`);

  handlePaginationChange = (page, limit) => {
    this.changeHistory({ page, limit });
  }

  render () {
    const { params, count } = this.props;
    return (
      <AntPagination
        defaultCurrent={1}
        current={params.page}
        className={styles.pagination}
        defaultPageSize={settings.PAGE_SIZE}
        pageSize={params.limit || settings.PAGE_SIZE}
        showTotal={total => `Total ${total} demandes`}
        total={count}
        onChange={this.handlePaginationChange}
      />
    );
  }
}

export default withRouter(Pagination);
