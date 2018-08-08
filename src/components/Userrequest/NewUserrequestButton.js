import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';

import withAuthentication from 'hoc/authentication';

const NewUserrequestButton = props => {
  if (props.isStaff) {
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

export default withAuthentication(NewUserrequestButton);
