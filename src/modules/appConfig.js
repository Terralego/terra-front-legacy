import { CALL_API } from 'middlewares/api';

export const UPDATE_VALUE = 'config/UPDATE_VALUE';

// Get app config
export const CONFIG_REQUEST = 'config/CONFIG_REQUEST';
export const CONFIG_SUCCESS = 'config/CONFIG_SUCCESS';
export const CONFIG_FAILURE = 'config/CONFIG_FAILURE';

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
    // case CONFIG_SUCCESS:
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
    types: [CONFIG_REQUEST, CONFIG_SUCCESS, CONFIG_FAILURE],
    config: { method: 'GET' },
  },
});
