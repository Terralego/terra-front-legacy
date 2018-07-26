import React from 'react';
import PropTypes from 'prop-types';

import withAuthentication from 'hoc/authentication';
import Select from 'components/Fields/Select';

const recipientsOptions = [
  { label: 'Demandeur et ONF', value: false },
  { label: 'ONF uniquement', value: true },
];

const CommentRecipients = ({ userGroup }) => (
  <React.Fragment>
    {userGroup === 'N2' && <Select
      placeholder="Choisir un destinataire"
      model=".is_internal"
      options={recipientsOptions}
      errorMessages={{ required: { message: 'Veuillez choisir un destinataire' } }}
    />}
    {userGroup === 'N1' &&
      <p>Votre message ne sera visible qu'en interne.</p>
    }
  </React.Fragment>
);

CommentRecipients.propTypes = {
  userGroup: PropTypes.string.isRequired,
};

export default withAuthentication(CommentRecipients);
