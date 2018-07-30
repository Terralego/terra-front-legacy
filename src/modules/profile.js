import initialState from 'modules/profile-initial';
import { defaultHeaders } from 'services/apiService';
import { CALL_API } from 'middlewares/api';
import { SET_AUTHENTICATION } from 'modules/authentication';

export const UPDATE_PROPERTIES = 'profile/UPDATE_PROPERTIES';

export const PROFILE_REQUEST = 'profile/PROFILE_REQUEST';
export const PROFILE_SUCCESS = 'profile/PROFILE_SUCCESS';
export const PROFILE_FAILURE = 'profile/PROFILE_FAILURE';

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

    case PROFILE_REQUEST:
      return {
        ...state,
      };
    case PROFILE_SUCCESS:
      return {
        ...state,
      };
    case SET_AUTHENTICATION: {
      return {
        ...state,
        properties: Object.keys(action.payload).length !== 0
          ? { ...initialState.properties, ...action.payload.user.properties }
          : state.properties,
      };
    }
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
    types: [PROFILE_REQUEST, PROFILE_SUCCESS, PROFILE_FAILURE],
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
