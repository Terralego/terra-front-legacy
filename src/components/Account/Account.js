import React from 'react';
import { withRouter } from 'react-router-dom';

import ResetPassWord from 'components/Account/ResetPassword';

const Account = () => (
  <div>
    <h1>Modifier mon mot de passe</h1>
    <ResetPassWord />
  </div>
);

export default withRouter(Account);
