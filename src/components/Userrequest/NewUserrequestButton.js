import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { getUserGroup } from 'modules/authentication';

const NewUserrequestButton = props => {
  if (props.userGroup === 'N1' || props.userGroup === 'N2') {
    return null;
  }

  return (
    <Link to="/new-request">
      <Button
        icon="file-add"
        type={props.type || 'primary'}
        className={props.className}
        style={props.style}
      >
        Déclarer une activité
      </Button>
    </Link>
  );
};

const mapStateToProps = state => ({
  userGroup: getUserGroup(state),
});

export default connect(mapStateToProps, null)(NewUserrequestButton);
