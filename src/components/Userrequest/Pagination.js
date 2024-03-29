import React from 'react';
import { withRouter } from 'react-router-dom';
import { Pagination as AntPagination } from 'antd';
import settings from 'front-settings';

import styles from './UserrequestList.module.scss';

class Pagination extends React.Component {
  handlePaginationChange = (page, limit) => {
    this.props.handleQueryUpdate({ page, limit });
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
        showTotal={total => `Total ${total} déclarations`}
        total={count}
        onChange={this.handlePaginationChange}
      />
    );
  }
}

export default withRouter(Pagination);
