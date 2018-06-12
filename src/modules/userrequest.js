import { CALL_API } from 'middlewares/api';
import initialState from 'modules/userrequest-initial';

export const UPDATE_DATA_PROPERTIES = 'userrequest/UPDATE_DATA_PROPERTIES';
export const ADD_GEOSJON_FEATURE = 'userrequest/ADD_GEOSJON_FEATURE';
export const REMOVE_GEOSJON_FEATURE = 'userrequest/REMOVE_GEOSJON_FEATURE';
export const POST_DATA = 'userrequest/POST_DATA';
export const SUBMIT_DATA_SUCCESS = 'userrequest/SUBMIT_DATA_SUCCESS';
export const SUBMIT_DATA_FAILED = 'userrequest/SUBMIT_DATA_FAILED';

// Get draft request actions
export const REQUEST_EXISTING = 'userrequestList/REQUEST_EXISTING';
export const SUCCESS_EXISTING = 'userrequestList/SUCCESS_EXISTING';
export const FAILURE_EXISTING = 'userrequestList/FAILURE_EXISTING';

// New userrequest
export const CLEAR = 'userrequestList/CLEAR';

/**
 * REDUCER
 * --------------------------------------------------------- *
 */
const userrequest = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_DATA_PROPERTIES:
      return {
        ...state,
        properties: {
          ...state.properties,
          ...action.properties,
        },
      };
    case ADD_GEOSJON_FEATURE:
      return {
        ...state,
        geojson: {
          ...state.geojson,
          features: [
            ...state.geojson.features,
            action.feature,
          ],
        },
      };
    case REMOVE_GEOSJON_FEATURE:
      return {
        ...state,
        geojson: {
          ...state.geojson,
          features: state.geojson.features
            .filter(feature => feature.properties.id !== action.featureId),
        },
      };
    case SUCCESS_EXISTING:
      return action.data;
    case CLEAR:
      return initialState;
    // case POST_DATA:
    //   return {
    //     ...state,
    //     submitted: true,
    //   };
    // case SUBMIT_DATA_SUCCESS:
    //   return {
    //     ...state,
    //     sent: true,
    //     apiError: null,
    //   };
    // case SUBMIT_DATA_FAILED:
    //   return {
    //     ...state,
    //     apiError: action.error,
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
 * userrequest action
 * updateRequestProperties add or update an object of properties
 * @param  {object} properties : object of properties to add / update in userrequest object
 */
export const updateRequestProperties = properties => ({
  type: UPDATE_DATA_PROPERTIES,
  properties,
});

/**
 * userrequest action
 * addRequestFeature add or update an object of properties
 * @param  {object} properties : object of properties to add / update in userrequest object
 */
export const addRequestFeature = feature => ({
  type: ADD_GEOSJON_FEATURE,
  feature,
});

/**
 * userrequest action
 * removeRequestFeature remove or update an object of properties
 * @param  {object} properties : object of properties to remove / update in userrequest object
 */
export const removeRequestFeature = featureId => ({
  type: REMOVE_GEOSJON_FEATURE,
  featureId,
});

/**
 * userrequest action
 * clear userrequest to get a blank form
 */
export const clear = () => ({
  type: CLEAR,
});

/**
 * Submit data object
 * @param  {object} data : data that will be send to the server
 */
export const submitData = data => ({
  [CALL_API]: {
    endpoint: '/userrequest/',
    types: [POST_DATA, SUBMIT_DATA_SUCCESS, SUBMIT_DATA_FAILED],
    config: {
      method: 'POST',
      body: JSON.stringify(data),
    },
    form: 'userrequest',
  },
});

/**
 * userrequest action : fetch userrequest
 * @param {string} id
 */
export const getUserrequest = id => ({
  [CALL_API]: {
    endpoint: `/userrequest/${id}`,
    types: [REQUEST_EXISTING, SUCCESS_EXISTING, FAILURE_EXISTING],
    config: { method: 'GET' },
  },
});
