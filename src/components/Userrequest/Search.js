import React from 'react';
import { withRouter } from 'react-router-dom';
import { Input } from 'antd';
import queryString from 'query-string';

class Search extends React.Component {
  getDefaultValue = () => queryString.parse(this.props.location.search).search;

  /**
   * changeHistory add query string parameter in url
   * duplicate function with Pagination component : see https://github.com/supasate/connected-react-router
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

  handleSearchChange = search => {
    this.changeHistory({ search });
  }

  render () {
    return (
      <Input.Search
        addonBefore="Chercher :"
        placeholder="Numéro de demande, titre de l'événement, type d'activité..."
        onSearch={this.handleSearchChange}
        defaultValue={this.getDefaultValue()}
        enterButton
      />
    );
  }
}

export default withRouter(Search);
