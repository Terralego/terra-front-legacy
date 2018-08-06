import React from 'react';
import { withRouter } from 'react-router-dom';
import { Input } from 'antd';
import queryString from 'query-string';

class Search extends React.Component {
  getDefaultValue = () => queryString.parse(this.props.location.search).search;

  handleSearchChange = search => {
    this.props.handleQueryUpdate({ search }, true);
  }

  render () {
    return (
      <Input.Search
        addonBefore={window.screen.width <= 400 ? '' : 'Chercher :'}
        placeholder="Numéro de déclaration, titre de l'événement&hellip;"
        onSearch={this.handleSearchChange}
        defaultValue={this.getDefaultValue()}
        enterButton
      />
    );
  }
}

export default withRouter(Search);
