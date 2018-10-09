import React from 'react';
import { Icon } from 'antd';
import { Link } from 'react-router-dom';

const Error404 = () => (
  <div>
    <h1>Erreur 404 : Page introuvable.</h1>
    <p><strong>Retourner à la page d&#39;accueil: </strong>
      <Link to="/">
        <Icon type="home" />
        Accueil
      </Link>
    </p>
  </div>
);

export default Error404;
