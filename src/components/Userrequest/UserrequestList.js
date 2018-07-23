import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter, Redirect } from 'react-router-dom';
import { Table, Icon, Modal, Button, message } from 'antd';
import queryString from 'query-string';

import { getUserGroup } from 'modules/authentication';
import { submitData, saveDraft } from 'modules/userrequest';
import { requestUserrequestPage, updateState, getUserrequestsArrayFilteredByUser } from 'modules/userrequestList';
import { getPaginationParams, isCurrentPageFetching, resetPaginationCache } from 'modules/pagination';

import getColumns from 'helpers/userrequestListColumns';

import NewUserrequestButton from 'components/Userrequest/NewUserrequestButton';
import Pagination from 'components/Userrequest/Pagination';
import Search from 'components/Userrequest/Search';

import styles from './UserrequestList.module.scss';

class UserrequestList extends React.Component {
  state = {
    selectedRowKeys: [],
  };

  componentDidMount () {
    if (!this.props.loading) {
      this.props.requestUserrequestPage(this.props.location.search);
    }
  }

  componentDidUpdate (prevProps) {
    if (prevProps.location.search !== this.props.location.search && !this.props.loading) {
      this.props.requestUserrequestPage(this.props.location.search);
    }

    if (prevProps.draft.id !== this.props.draft.id) {
      this.props.resetPaginationCache('/userrequest/');
      message.destroy();
    }
  }

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  }

  /**
   * getSelectedItems
   * @param  {array} properties : this.props.items
   * @return {array} properties : clone of this.props.items filter by selected items
   */
  getSelectedItems = () => (
    this.props.items
      .filter(item => this.state.selectedRowKeys.includes(item.id))
      .map(item => ({
        ...item,
        properties: {
          ...item.properties,
        },
      }))
  )

  /**
   * queryUpdate add query string parameter in url
   * duplicate function with Search component : see https://github.com/supasate/connected-react-router
   * to implement history change in actions / reducers
   * @param {object} query : couple(s) of key / value parameter(s)
   */
  handleQueryUpdate = (query, reset) => {
    const params = { ...query };
    if (reset) {
      this.props.resetPaginationCache('/userrequest/');
      params.page = 1;
    }
    return this.props.history.push(`/manage-request/?${
      queryString.stringify({
        ...queryString.parse(this.props.location.search),
        ...params,
      })
    }`);
  }

  handleCopy = () => {
    const selectedItems = this.getSelectedItems();
    Modal.confirm({
      title: selectedItems.length > 1 ? 'Êtes-vous sûr de vouloir dupliquer ces demandes ?' : 'Êtes-vous sûr de vouloir dupliquer cette demande ?',
      content: selectedItems.length > 1 ? 'Les nouvelles demandes prendront le statut "Brouillon".' : 'La nouvelle demande prendra le statut "Brouillon".',
      onOk: () => {
        message.loading('Duplication de la demande en cours...', 2.5);
        const item = selectedItems[0];
        delete item.id;
        item.properties.title += ' - copie';
        this.props.saveDraft(item);
        this.setState({
          selectedRowKeys: [],
        });
      },
    });
  }

  handleCancel = () => {
    const selectedItems = this.getSelectedItems();
    Modal.confirm({
      title: selectedItems.length > 1 ? 'Êtes-vous sûr de vouloir annuler ces demandes ?' : 'Êtes-vous sûr de vouloir annuler cette demande ?',
      content: selectedItems.length > 1 ? 'Les nouvelles demandes prendront le statut "Annuler".' : 'La nouvelle demande prendra le statut "Annuler".',
      onOk: () => {
        selectedItems
          .forEach(item => {
            this.props.updateState(item.id, -2);
          });
        this.setState({
          selectedRowKeys: [],
        });
      },
    });
  }

  handleClickOnRow (id) {
    this.props.history.push(`/manage-request/detail/${id}`);
  }

  render () {
    const { selectedRowKeys } = this.state;
    const { draft, location, userGroup, columns, pagination } = this.props;

    // If a draft newly created, redirect on its
    if (draft.id) {
      return (
        <Redirect
          to={{ pathname: `/manage-request/detail/${draft.id}`,
          state: {
            from: `${location.pathname}${location.search}`,
          } }}
        />
      );
    }

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;

    return (
      <div>
        <div className={styles.header}>
          <h1 className={styles.header__title}>Déclarations d&apos;activité(s)</h1>
          <NewUserrequestButton className={styles.header__button} />
        </div>
        <div className={styles.header}>
          <Search handleQueryUpdate={this.handleQueryUpdate} />
        </div>
        {(userGroup !== 'N1' && userGroup !== 'N2') && (
          <div className={styles.actions}>
            <Button
              className={styles.actions__button}
              onClick={this.handleCopy}
              disabled={!hasSelected || selectedRowKeys.length > 1}
            >
              <Icon type="copy" />
              Dupliquer la demande
            </Button>
            <Button
              className={styles.actions__button}
              type="danger"
              onClick={this.handleCancel}
              disabled={!hasSelected}
            >
              <Icon type="minus-circle-o" className={styles.actions__iconCancel} />
              Annuler {selectedRowKeys.length} {selectedRowKeys.length > 1 ? 'demandes sélectionnées' : 'demande sélectionnée'}
            </Button>
          </div>
        )}
        <Table
          rowKey="id"
          columns={columns}
          dataSource={this.props.items}
          rowSelection={(userGroup !== 'N1' && userGroup !== 'N2') ? rowSelection : null}
          loading={this.props.loading}
          onRow={record => (
            {
              onClick: () => {
                this.handleClickOnRow(record.id);
              },
            }
          )}
          pagination={false}
        />
        <Pagination {...pagination} handleQueryUpdate={this.handleQueryUpdate} />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  draft: state.userrequest,
  items: getUserrequestsArrayFilteredByUser(state, ownProps.location.search),
  loading: isCurrentPageFetching(state.pagination.userrequestList, ownProps.location.search),
  userGroup: getUserGroup(state),
  columns: getColumns(getUserGroup(state)),
  pagination: getPaginationParams(state.pagination.userrequestList, ownProps.location.search),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({
    requestUserrequestPage,
    resetPaginationCache,
    submitData,
    saveDraft,
    updateState,
  }, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserrequestList));
