import store from 'store';

const statusLabels = {
  DRAFT: { text: 'Demande sauvegardée non envoyée', type: 'info' },
  REFUSED: { text: 'Demande refusée', type: 'error' },
  ACCEPTED: { text: 'Demande acceptée', type: 'success' },
  // Specific for N1 and N2
  TO_EVALUATE: { text: 'A évaluer', type: 'warning' },
  WAIT_NIV2: { text: 'En cours d’évaluation par l’instructeur de Niv 2', type: 'warning' },
  WAIT_NIV1: { text: 'En cours d’évaluation par l’instructeur de Niv 1', type: 'warning' },
  WAIT_USER: { text: 'En attente d\'éléments de la part du demandeur', type: 'warning' },
  // Specific for user
  WAITING: { text: 'En cours de traitement par l\'ONF', type: 'warning' },
  TO_COMPLETE: { text: 'En attente d\'éléments supplémentaires de votre part', type: 'warning' },
};
/**
 * getUserrequestStatus
 *
 * @param {number} state - state of the userrequest
 * @param {object} approbations - approbations of the userrequest
 * @param {group} userGroup - user's group
 * @param {group} userUuid - user's uuid
 */
const getUserrequestStatus = (userrequestState, approbations, userGroup, userUuid) => {
  const { states, approbation_statuses } = store.getState().appConfig;
  // console.log(approbations, approbation_statuses);

  // console.log(states[userrequestState], statusLabels[states[userrequestState]]);
  // Same label for all groups
  if (states[userrequestState] === 'DRAFT'
  || states[userrequestState] === 'REFUSED') {
    return statusLabels[states[userrequestState]];
  }

  // Specific labels for N1
  if (userGroup === 'N1') {
    if (states[userrequestState] === 'SUBMITTED') {
      const N1approved = approbations && approbations[userUuid];
      if (N1approved) {
        const N1status = approbation_statuses[N1approved];
        // Current N1 already approved, need N2
        if (N1status) {
          return statusLabels.WAIT_NIV1;
        }
      }
      return statusLabels.TO_EVALUATE;
    }
  }

  // Specific labels for N2
  if (userGroup === 'N2') {
    if (states[userrequestState] === 'SUBMITTED') {
      return statusLabels.TO_EVALUATE;
    }
  }

  // Specific labels for users
  if (states[userrequestState] === 'SUBMITTED') {
    return statusLabels.WAITING;
  }

  return null;
};

export default getUserrequestStatus;
