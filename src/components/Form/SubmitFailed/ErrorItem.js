import React from 'react';

import SmoothLink from 'components/SmoothLink';

function getError (error) {
  switch (error) {
    case 'userrequest.properties.activities':
      return { label: 'Description de l\'activité', target: error };
    case 'userrequest.properties.title':
      return { label: 'Titre de la déclaration', target: error };
    case 'userrequest.properties.description':
      return { label: 'Description de la déclaration', target: error };
    case 'userrequest.properties.features':
      return { label: 'Tracé de l\'activité', target: 'userrequest.properties.activities' };
    default:
      return {};
  }
}

export const ErrorItem = ({ error }) => {
  const { label, target } = getError(error);

  if (!label) return null;

  return (
    <li>
      <SmoothLink
        target={target}
        margin={50}
      >
        {label}
      </SmoothLink>
    </li>
  );
};

export default ErrorItem;
