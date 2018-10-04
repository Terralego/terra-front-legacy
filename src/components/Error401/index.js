import React from 'react';
import { Icon } from 'antd';
import { Link } from 'react-router-dom';

const Error401 = () => (
  <div>
    <h1>Erreur 401 : Accès interdit.</h1>
    <p><strong>Retourner à la page d&#39;accueil: </strong>
      <Link to="/">
        <Icon type="home" />
        Accueil
      </Link>
    </p>
  </div>
);

export default Error401;
