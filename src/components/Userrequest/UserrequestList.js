import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Table, Icon, Modal, Button, message } from 'antd';

import { getUserGroups } from 'modules/authentication';
import { submitData, saveDraft, duplicate } from 'modules/userrequest';
import { requestUserrequestPage, resetUserrequestsList, updateState } from 'modules/userrequestList';

import getColumns from 'helpers/userrequestListColumns';

import withAuthentication from 'hoc/authentication';

import NewUserrequestButton from 'components/Userrequest/NewUserrequestButton';
import Paginate from 'components/Paginate';
import Pagination from 'components/Userrequest/Pagination';
import Search from 'components/Userrequest/Search';
import { hasGroup, REQUEST_CREATE } from 'helpers/permissionsHelpers';
import Permissions from 'components/Permissions';

import styles from './UserrequestList.module.scss';

const DEFAULT_ORDERING = '-id';

class UserrequestList extends React.Component {
  static propTypes = {
    renderHeader: PropTypes.func,
  }

  static defaultProps = {
    renderHeader: ({ isUser, location: { search } }) => getColumns(isUser, search),
  }

  state = {
    selectedRowKeys: [],
  };

  componentDidMount () {
    if (!this.props.loading) {
      this.props.requestUserrequestPage(this.currentPage, this.currentOrdering);
    }
  }

  componentDidUpdate (prevProps) {
    if (prevProps.location.search !== this.props.location.search && !this.props.loading) {
      this.props.requestUserrequestPage(this.currentPage, this.currentOrdering);
    }
  }

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  }

  get currentPage () {
    const { location: { search = '' } } = this.props;
    const [, page] = search.match(/page=([0-9]+)/) || [undefined, 1];
    return +page;
  }

  get currentOrdering () {
    const { location: { search = '' } } = this.props;
    const [, ordering] = search.match(/ordering=([^&]+)/) || [undefined, DEFAULT_ORDERING];
    return ordering;
  }

  /**
   * getSelectedItems
   * @param  {array} properties : this.props.items
   * @return {array} properties : clone of this.props.items filter by selected items
   */
  getSelectedItems = () => (
    this.props.items
      .filter(item => item)
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
  handleQueryUpdate = ({ page = this.currentPage, ordering = this.currentOrdering }, reset) => {
    const { location: { pathname }, history: { push } } = this.props;
    if (reset) {
      this.props.resetUserrequestsList();
    }
    return push(`${pathname}?page=${page}&ordering=${ordering}`);
  }

  handleCopy = () => {
    const selectedItems = this.getSelectedItems();
    Modal.confirm({
      title: selectedItems.length > 1 ? "Êtes-vous sûr de vouloir dupliquer ces déclarations d'activités ?" : "Êtes-vous sûr de vouloir dupliquer cette déclaration d'activité ?",
      content: selectedItems.length > 1 ? 'Les nouvelles déclarations prendront le statut "Brouillon".' : 'La nouvelle déclaration prendra le statut "Brouillon".',
      onOk: async () => {
        message.loading('Duplication de la déclaration en cours...', 2.5);
        await this.props.duplicate(selectedItems.map(item => ({ item, title: '{{title}} - copie' })));
        const { location: { pathname }, history: { push } } = this.props;
        push(pathname);
        this.setState({
          selectedRowKeys: [],
        });
      },
    });
  }

  handleCancel = () => {
    const selectedItems = this.getSelectedItems();
    Modal.confirm({
      title: selectedItems.length > 1 ? 'Êtes-vous sûr de vouloir annuler ces déclarations ?' : 'Êtes-vous sûr de vouloir annuler cette déclaration ?',
      content: selectedItems.length > 1 ? 'Les nouvelles déclarations prendront le statut "Annuler".' : 'La nouvelle déclaration prendra le statut "Annuler".',
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

  handleTableChange = (pagination, filters, sorter) => {
    let query = {};
    const ObjectKeysFilters = Object.keys(filters);
    if (ObjectKeysFilters.length) {
      query = ObjectKeysFilters.reduce((acc, current) => ({
        ...acc,
        [`${current}__in`]: filters[current].join(','),
      }), {});
    }
    if (Object.keys(sorter).length) {
      const order = sorter.order === 'descend' ? '-' : '';
      query.ordering = `${order}${sorter.field.replace('.', '__')}`;
    }
    this.handleQueryUpdate(query, true);
  }

  render () {
    const { selectedRowKeys } = this.state;
    const { isUser, items, loading, renderHeader } = this.props;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;

    return (
      <div>
        <div className={styles.header}>
          <h1 className={styles.header__title}>Déclarations d&apos;activité(s)</h1>
          <Permissions
            permissions={[REQUEST_CREATE]}
          >
            <NewUserrequestButton className={styles.header__button} />
          </Permissions>
        </div>
        <div className={styles.header}>
          <Search handleQueryUpdate={this.handleQueryUpdate} />
        </div>
        <Permissions
          permissions={[REQUEST_CREATE]}
        >
          <div className={styles.actions}>
            <Button
              className={styles.actions__button}
              onClick={this.handleCopy}
              disabled={!hasSelected}
            >
              <Icon type="copy" />
              {selectedRowKeys.length > 1
                ? `Dupliquer les ${selectedRowKeys.length} déclarations`
                : 'Dupliquer la déclaration'}

            </Button>
            <Button
              className={styles.actions__button}
              type="danger"
              onClick={this.handleCancel}
              disabled={!hasSelected}
            >
              <Icon type="stop" />
              Annuler {selectedRowKeys.length} {selectedRowKeys.length > 1 ? 'déclarations sélectionnées' : 'déclaration sélectionnée'}
            </Button>
          </div>
        </Permissions>
        <Paginate
          items={items}
          page={this.currentPage}
        >
          {pagedItems => (
            <Table
              rowKey="id"
              scroll={{ x: 800 }}
              columns={renderHeader(this.props)}
              dataSource={pagedItems}
              rowSelection={isUser ? rowSelection : null}
              loading={!pagedItems.length && loading}
              onRow={record => (
                {
                  onClick: () => {
                    this.handleClickOnRow(record.id);
                  },
                }
              )}
              pagination={false}
              onChange={this.handleTableChange}
            />
          )}
        </Paginate>
        <Pagination
          handleQueryUpdate={this.handleQueryUpdate}
          params={{
            page: this.currentPage,
            pageSize: 10,
          }}
          count={items ? items.length : 0}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  items: state.userrequestList.items.map(id => state.userrequestList[id]),
  loading: state.userrequestList.loading,
  isUser: hasGroup(getUserGroups(state), 'user'),
});

const mapDispatchToProps = dispatch => bindActionCreators({
  requestUserrequestPage,
  resetUserrequestsList,
  submitData,
  saveDraft,
  updateState,
  duplicate,
}, dispatch);

export default withRouter(withAuthentication(connect(
  mapStateToProps,
  mapDispatchToProps,
)(UserrequestList)));
