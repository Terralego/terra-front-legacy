import store from 'store';

const statusLabels = {
  DRAFT: { text: 'Brouillon', type: 'info' },
  REFUSED: { text: 'Déclaration refusée', type: 'error' },
  CANCELED: { text: 'Déclaration annulée ', type: 'error' },
  ACCEPTED: { text: 'Déclaration acceptée', type: 'success' },
  NO_STATUS: { text: 'Pas de statut connu', type: 'warning' },
};

/**
 * getUserrequestStatus
 *
 * @param {object} userrequest - state of the userrequest
 */
const getUserrequestStatus = userrequest => {
  const { states } = store.getState().appConfig;

  // Same label for all groups
  if (userrequest.state === states.DRAFT) {
    return statusLabels.DRAFT;
  }

  if (userrequest.state === states.REFUSED) {
    return statusLabels.REFUSED;
  }

  if (userrequest.state === states.ACCEPTED) {
    return statusLabels.ACCEPTED;
  }

  if (userrequest.state === states.CANCELED) {
    return statusLabels.CANCELED;
  }

  return statusLabels.NO_STATUS;
};

export default getUserrequestStatus;
