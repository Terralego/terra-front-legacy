import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Pagination as AntPagination } from 'antd';
import queryString from 'query-string';
import settings from 'front-settings';

import styles from './UserrequestList.module.scss';

class Pagination extends React.Component {
  handlePaginationChange = (page, pageSize) => {
    this.props.history.push(`/manage-request/?limit=${pageSize}&page=${page}`);
  }

  render () {
    const { pagination, location } = this.props;
    const query = queryString.parse(location.search);
    const current = query.page ? parseInt(query.page, 10) : null;
    const pageSize = query.limit ? parseInt(query.limit, 10) : null;

    return (
      <AntPagination
        defaultCurrent={1}
        current={current}
        className={styles.pagination}
        defaultPageSize={settings.PAGE_SIZE}
        pageSize={pageSize || settings.PAGE_SIZE}
        showTotal={total => `Total ${total} demandes`}
        total={pagination.count}
        onChange={this.handlePaginationChange}
      />
    );
  }
}

const StateToProps = state => ({
  pagination: state.userrequestList.pagination,
});

export default withRouter(connect(StateToProps, null)(Pagination));
