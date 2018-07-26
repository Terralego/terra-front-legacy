import store from 'store';
import moment from 'moment';

const statusLabels = {
  DRAFT: { text: 'Brouillon', type: 'info' },
  REFUSED: { text: 'Déclaration refusée', type: 'error' },
  CANCELED: { text: 'Déclaration annulée ', type: 'error' },
  ACCEPTED: { text: 'Déclaration acceptée', type: 'success' },
  // Specific for N1 and N2
  TO_EVALUATE: { text: 'À évaluer', type: 'warning' },
  WAIT_NIV1: { text: 'En cours d’évaluation par l’instructeur de Niv 1', type: 'warning' },
  WAIT_NIV2: { text: 'En cours d’évaluation par l’instructeur de Niv 2', type: 'warning' },
  WAIT_USER: { text: 'En attente d\'éléments de la part du demandeur', type: 'warning' },
  // Specific for user
  WAITING: { text: 'En cours de traitement', type: 'warning' },
  TO_COMPLETE: { text: 'En attente d\'éléments supplémentaires de votre part', type: 'warning' },
  NO_STATUS: { text: 'Pas de status connu', type: 'warning' },
};

/**
 * getUserrequestStatus
 *
 * @param {number} state - state of the userrequest
 * @param {object} approbations - approbations of the userrequest
 * @param {object} user - user's group
 * @param {string} user.group - user's group
 * @param {string} user.uuid - user's uuid
 */
const getUserrequestStatus = (userrequestState, approbations, user, userrequestExpiry) => {
  const { states } = store.getState().appConfig;
  const expiry = userrequestExpiry ? `avant le ${moment(userrequestExpiry).format('DD/MM/YYYY')}` : '';

  // Same label for all groups
  if (userrequestState === states.DRAFT) {
    return statusLabels.DRAFT;
  }

  if (userrequestState === states.REFUSED) {
    return statusLabels.REFUSED;
  }

  if (userrequestState === states.ACCEPTED) {
    return statusLabels.ACCEPTED;
  }

  if (userrequestState === states.CANCELED) {
    return statusLabels.CANCELED;
  }

  // Specific labels for N1
  if (user.group === 'N1') {
    if (userrequestState === states.SUBMITTED) {
      const N1approved = approbations && approbations[user.uuid];
      if (N1approved) {
        // Current N1 already approved, need N2
        return statusLabels.WAIT_NIV2;
      }
      return {
        ...statusLabels.TO_EVALUATE,
        text: `${statusLabels.TO_EVALUATE.text} ${expiry}`,
      };
    }
  }

  // Specific labels for N2
  if (user.group === 'N2') {
    if (userrequestState === states.SUBMITTED) {
      return {
        ...statusLabels.TO_EVALUATE,
        text: `${statusLabels.TO_EVALUATE.text} ${expiry}`,
      };
    }
  }

  // Specific labels for users
  if (userrequestState === states.SUBMITTED) {
    return statusLabels.WAITING;
  }

  return statusLabels.NO_STATUS;
};

export default getUserrequestStatus;
