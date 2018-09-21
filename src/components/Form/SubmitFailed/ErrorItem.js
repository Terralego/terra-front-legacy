import React from 'react';

import SmoothLink from 'components/SmoothLink';

function getError (label) {
  switch (label) {
    case 'userrequest.properties.activities':
      return 'Description de l\'activité';
    case 'userrequest.properties.title':
      return 'Titre de la déclaration';
    case 'userrequest.properties.description':
      return 'Description de la déclaration';
    default:
      return null;
  }
}

export const ErrorItem = ({ error }) => {
  const label = getError(error);

  if (!label) return null;

  return (
    <li>
      <SmoothLink
        target={error}
        margin={50}
      >
        {label}
      </SmoothLink>
    </li>
  );
};

export default ErrorItem;
