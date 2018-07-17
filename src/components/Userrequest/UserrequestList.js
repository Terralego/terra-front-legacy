import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Table, Icon, Modal, Button } from 'antd';

import { getUserGroup } from 'modules/authentication';
import { submitData } from 'modules/userrequest';
import { requestUserrequestPage, updateState, getUserrequestsArrayFilteredByUser } from 'modules/userrequestList';
import { getPaginationParams, isCurrentPageFetching } from 'modules/pagination';

import getColumns from 'helpers/userrequestListColumns';

import NewUserrequestButton from 'components/Userrequest/NewUserrequestButton';
import Pagination from 'components/Userrequest/Pagination';

import styles from './UserrequestList.module.scss';

class UserrequestList extends React.Component {
  state = {
    selectedRowKeys: [],
  };

  componentDidMount () {
    this.props.requestUserrequestPage(this.props.location.search);
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

  handleCopy = () => {
    const selectedItems = this.getSelectedItems();
    Modal.confirm({
      title: selectedItems.length > 1 ? 'Êtes-vous sûr de vouloir dupliquer ces demandes ?' : 'Êtes-vous sûr de vouloir dupliquer cette demande ?',
      content: selectedItems.length > 1 ? 'Les nouvelles demandes prendront le statut "Brouillon".' : 'La nouvelle demande prendra le statut "Brouillon".',
      onOk: () => {
        selectedItems
          .forEach(selectedItem => {
            const item = { ...selectedItem };
            delete item.id;
            item.properties.title += ' - copie';
            this.props.saveDraft(item);
          });
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
    const { userGroup, columns, pagination } = this.props;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;

    return (
      <div>
        <div className={styles.header}>
          <h1 className={styles.header__title}>Demandes d&apos;autorisation</h1>
          <NewUserrequestButton className={styles.header__button} />
        </div>
        {(userGroup !== 'N1' && userGroup !== 'N2') && (
          <div className={styles.actions}>
            <Button
              className={styles.actions__button}
              onClick={this.handleCopy}
              disabled={!hasSelected}
            >
              <Icon type="copy" />
              Dupliquer {selectedRowKeys.length} {selectedRowKeys.length > 1 ? 'demandes sélectionnées' : 'demande sélectionnée'}
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
        <Pagination {...pagination} />
      </div>
    );
  }
}

const StateToProps = (state, ownProps) => ({
  items: getUserrequestsArrayFilteredByUser(state),
  loading: isCurrentPageFetching(state.pagination.userrequestList),
  userGroup: getUserGroup(state),
  columns: getColumns(getUserGroup(state)),
  pagination: getPaginationParams(state.pagination.userrequestList, ownProps.location.search),
});

const DispatchToProps = dispatch =>
  bindActionCreators({
    requestUserrequestPage,
    submitData,
    updateState,
  }, dispatch);

export default withRouter(connect(StateToProps, DispatchToProps)(UserrequestList));
