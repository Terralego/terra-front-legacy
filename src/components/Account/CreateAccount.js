import React from 'react';
import { withRouter } from 'react-router-dom';

import ResetPassWord from 'components/Account/ResetPassword';

const CreateAccount = props => {
  const [uidb64, token] = props.location.pathname.split('/').slice(2);
  return (
    <div>
      <h2>Choisissez un nouveau mot de passe pour activer votre compte</h2>
      <ResetPassWord uidb64Token={`${uidb64}/${token}/`} />
    </div>
  );
};

export default withRouter(CreateAccount);
