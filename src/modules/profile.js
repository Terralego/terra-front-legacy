import initialState from 'modules/profile-initial';
import { defaultHeaders } from 'services/apiService';
import { CALL_API } from 'middlewares/api';

export const UPDATE_PROPERTIES = 'profile/UPDATE_PROPERTIES';

export const SUBMIT_REQUEST = 'profilerequest/SUBMIT_REQUEST';
export const SUBMIT_SUCCESS = 'profilerequest/SUBMIT_SUCCESS';
export const SUBMIT_FAILURE = 'profilerequest/SUBMIT_FAILURE';

/**
 * REDUCER
 * --------------------------------------------------------- *
 */
const profile = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_PROPERTIES:
      return {
        ...state,
        properties: {
          ...state.properties,
          ...action.properties,
        },
      };

    case SUBMIT_REQUEST:
      return {
        ...state,
        submitted: true,
        sent: false,
        error: null,
      };
    case SUBMIT_SUCCESS:
      return {
        ...state,
      };
    case SUBMIT_FAILURE:
      return {
        ...state,
        error: action.error,
      };
    default:
      return state;
  }
};

export default profile;


/**
 * ACTIONS
 * --------------------------------------------------------- *
 */

/**
 * profile action
 * updateProfileProperties add or update an object of properties
 * @param  {object} properties : object of properties to add / update in profile object
 */
export const updateProfileProperties = properties => ({
  type: UPDATE_PROPERTIES,
  properties,
});

/**
 * profile async action : post profile informations
 * @param {number}
 * @param {string}
 */
export const submitProfile = (email, properties, uuid) => ({
  [CALL_API]: {
    endpoint: '/accounts/user/',
    types: [SUBMIT_REQUEST, SUBMIT_SUCCESS, SUBMIT_FAILURE],
    config: {
      headers: defaultHeaders,
      method: 'PUT',
      body: JSON.stringify({
        email,
        properties,
        uuid,
      }),
    },
    form: 'profile',
  },
});
