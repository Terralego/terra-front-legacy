import React from 'react';
import SmoothLink from 'components/SmoothLink';

const errorTitles = {
  'userrequest.properties.title': 'Titre de la déclaration.',
  'userrequest.properties.description': 'Description de la déclaration.',
};

const getErrorTitle = error => {
  if (errorTitles[error]) {
    return errorTitles[error];
  }

  const [,, property, ...subFields] = error.split('.');

  if (property === 'activities') {
    const [activityId] = subFields;
    return <span>Détails de l'activité n°{+activityId + 1}.</span>;
  }

  if (property === 'vehicles') {
    const [, licenceId] = subFields;
    return <span>Détails du véhicule n°{+licenceId + 1}.</span>;
  }

  return `Erreur : ${error}`;
};

const ErrorLink = ({ error }) => (
  <li>
    <SmoothLink target={error} margin={50}>
      {getErrorTitle(error)}
    </SmoothLink>
  </li>
);

const ErrorMessages = ({ errors }) => {
  const mainFields = [
    'userrequest.properties.title',
    'userrequest.properties.description',
  ];

  const activityErrors = errors.filter(error => error.split('.')[2] === 'activities' && error.split('.')[3]);

  const activityIndexes = Object.keys(activityErrors.reduce((acc, error) =>
    ({ ...acc, [error.split('.')[3]]: true }), {}));

  const vehicleErrors = errors.filter(error => error.split('.')[2] === 'vehicles' && error.split('.')[4]);

  const vehicleIndexes = Object.keys(vehicleErrors.reduce((acc, error) =>
    ({ ...acc, [error.split('.')[4]]: true }), {}));

  return (
    <ul>
      {mainFields.map(fieldName => (
        errors.includes(fieldName)
          ? <ErrorLink key={fieldName} error={fieldName} />
          : null
      ))}

      {activityIndexes.map(activityIndex => (
        <ErrorLink key={activityIndex} error={`userrequest.properties.activities.${activityIndex}`} />
      ))}

      {vehicleIndexes.map(activityIndex => (
        <ErrorLink key={activityIndex} error={`userrequest.properties.vehicles.licences.${activityIndex}`} />
      ))}
    </ul>
  );
};

export default ErrorMessages;
