import initialState from 'modules/profile-initial';
import { defaultHeaders } from 'services/apiService';
import { CALL_API } from 'middlewares/api';
import { actions } from 'react-redux-form';

export const UPDATE_PROPERTIES = 'profile/UPDATE_PROPERTIES';

export const PROFILE_REQUEST = 'profile/PROFILE_REQUEST';
export const PROFILE_SUCCESS = 'profile/PROFILE_SUCCESS';
export const PROFILE_FAILURE = 'profile/PROFILE_FAILURE';

export const FILL_PROFILE_FROM_USER = 'FILL_PROFILE_FROM_USER';

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
          ...initialState.properties,
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
    case FILL_PROFILE_FROM_USER: {
      return {
        ...state,
        properties: {
          ...state.properties,
          ...action.properties,
        },
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
export const updateProfileProperties = properties => (dispatch, getState) => {
  dispatch(actions.reset('profile'));
  dispatch({
    type: UPDATE_PROPERTIES,
    properties: { ...getState().authentication.payload.user.properties, properties },
  });
};

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
