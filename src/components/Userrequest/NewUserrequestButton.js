import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';

const NewUserrequestButton = ({ type = 'primary', className, style }) => (
  <Link to="/new-request">
    <Button
      icon="file-add"
      type={type}
      className={className}
      style={style}
    >
      Déclarer une activité
    </Button>
  </Link>
);

export default NewUserrequestButton;
