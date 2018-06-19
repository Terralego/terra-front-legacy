import { CALL_API } from 'middlewares/api';

export const UPDATE_VALUE = 'config/UPDATE_VALUE';

// Get app config
export const REQUEST_CONFIG = 'config/CONFIG';
export const SUCCESS_CONFIG = 'config/SUCCESS_CONFIG';
export const FAILURE_CONFIG = 'config/FAILURE_CONFIG';

const initialState = {
  states: {
    DRAFT: 100,
    SUBMITTED: 200,
    ACCEPTED: 300,
    REFUSED: -1,
    CANCELED: -2,
  },

  approbation_statuses: {
    PENDING: 0,
    WAITING_FOR_INFORMATION: 1,
    ACCEPTED: 2,
    REFUSED: -1,
  },
};

/**
 * REDUCER
 * --------------------------------------------------------- *
 */
const userrequest = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_VALUE:
      return {
        ...state,
        [action.key]: action.value,
      };
    // TODO: uncomment when API is ready
    // case SUCCESS_CONFIG:
    //   return {
    //     ...state,
    //     ...action.data,
    //   };
    default:
      return state;
  }
};

export default userrequest;


/**
 * ACTIONS
 * --------------------------------------------------------- *
 */

/**
 * config action
 * updateConfigValue create or update a value of config key
 * @param  {string} key : the key of the new userrequest value
 * @param  {any} value : the new value
 */
export const updateConfigValue = (key, value) => ({
  type: UPDATE_VALUE,
  key,
  value,
});

/**
 * config action
 * getSettings fetch api settings
 */
export const getSettings = () => ({
  [CALL_API]: {
    endpoint: '/settings/',
    types: [REQUEST_CONFIG, SUCCESS_CONFIG, FAILURE_CONFIG],
    config: { method: 'GET' },
  },
});
