import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Table, Icon, Modal, Button } from 'antd';
import queryString from 'query-string';

import getColumns from 'helpers/userrequestListColumns';
import NewUserrequestButton from 'components/Userrequest/NewUserrequestButton';
import Pagination from 'components/Userrequest/Pagination';
import { getUserGroup } from 'modules/authentication';
import { submitData } from 'modules/userrequest';
import { fetchUserrequestList, updateState, getUserrequestsArrayFilteredByUser } from 'modules/userrequestList';

import styles from './UserrequestList.module.scss';

class UserrequestList extends React.Component {
  state = {
    selectedRowKeys: [],
  };

  componentDidMount () {
    // If no results, load it
    const query = queryString.parse(this.props.location.search);
    if (this.props.items.length < 1 && !this.props.loading) {
      this.props.fetchUserrequestList(query.limit, query.page);
    }

    this.unlisten = this.props.history.listen(location => {
      if (this.props.location.search !== location.search) {
        this.props.fetchUserrequestList(query.limit, query.page);
      }
    });
  }

  componentWillUnmount () {
    this.unlisten();
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
    const { userGroup, columns } = this.props;

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
        <Pagination />
      </div>
    );
  }
}

const StateToProps = state => ({
  items: getUserrequestsArrayFilteredByUser(state),
  loading: state.userrequestList.loading,
  userGroup: getUserGroup(state),
  columns: getColumns(getUserGroup(state)),
});

const DispatchToProps = dispatch =>
  bindActionCreators({
    fetchUserrequestList,
    submitData,
    updateState,
  }, dispatch);

export default withRouter(connect(StateToProps, DispatchToProps)(UserrequestList));
