import React from 'react';

import withAuthentication from 'hoc/authentication';
import Select from 'components/Fields/Select';
import { canCommentInternal } from 'helpers/permissionsHelpers';

const recipientsOptions = [
  { label: 'Demandeur et ONF', value: false },
  { label: 'ONF uniquement', value: true },
];

const CommentRecipients = ({ user }) => {
  const canCommentOnlyInternal = canCommentInternal(user.permissions, false);
  const canCommentExternal = user.permissions.includes('trrequests.can_comment_requests');
  const canCommentAll = canCommentExternal && user.permissions.includes('trrequests.can_internal_comment_requests');

  return (
    <React.Fragment>
      {canCommentOnlyInternal &&
        <p>Votre message ne sera visible qu'en interne.</p>
      }
      { canCommentAll &&
        <Select
          placeholder="Choisir un destinataire"
          model=".is_internal"
          options={recipientsOptions}
          errorMessages={{ required: { message: 'Veuillez choisir un destinataire' } }}
        />
      }
    </React.Fragment>
  );
};

export default withAuthentication(CommentRecipients);
