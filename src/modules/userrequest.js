import { CALL_API } from 'middlewares/api';
// import moment from 'moment';

import initialState from 'modules/userrequest-initial';

export const UPDATE_DATA_PROPERTIES = 'userrequest/UPDATE_DATA_PROPERTIES';
export const ADD_GEOSJON_FEATURE = 'userrequest/ADD_GEOSJON_FEATURE';
export const REMOVE_GEOSJON_FEATURE = 'userrequest/REMOVE_GEOSJON_FEATURE';

// Save draft userrequest actions
export const SAVE_DRAFT = 'userrequest/SAVE_DRAFT';
export const SUCCESS_SAVE_DRAFT = 'userrequest/SUBMIT_DRAFT_SUCCESS';
export const FAILURE_SAVE_DRAFT = 'userrequest/SUBMIT_DRAFT_FAILED';

// Submit userrequest actions
export const SUBMIT_DATA = 'userrequest/SUBMIT_DATA';
export const SUCCESS_SUBMIT_DATA = 'userrequest/SUCCESS_SUBMIT_DATA';
export const FAILURE_SUBMIT_DATA = 'userrequest/FAILURE_SUBMIT_DATA';

// Get draft request actions
export const REQUEST_EXISTING = 'userrequestList/REQUEST_EXISTING';
export const SUCCESS_EXISTING = 'userrequestList/SUCCESS_EXISTING';
export const FAILURE_EXISTING = 'userrequestList/FAILURE_EXISTING';

export const POST_FEATURE = 'userrequest/POST_FEATURE';
export const SUCCESS_POST_FEATURE = 'userrequest/SUCCESS_POST_FEATURE';
export const FAILURE_POST_FEATURE = 'userrequest/FAILURE_POST_FEATURE';

// New userrequest
export const CLEAR = 'userrequestList/CLEAR';

export const getFeaturesWithIncidence = (response, features) => {
  if (!response.results || response.results.length < 1) {
    return features;
  }

  return features.map(feature => {
    let incidence = { GRIDCODE: 0 };
    if (feature.properties.id !== response.request.callbackid) {
      return feature;
    }
    response.results.features.forEach(intersection => {
      if (intersection.properties[0].GRIDCODE > incidence.GRIDCODE) {
        incidence = {
          GRIDCODE: intersection.properties[0].GRIDCODE,
          date_from: intersection.properties[0].date_from,
          date_to: intersection.properties[0].date_to,
        };
      }
    });
    return {
      ...feature,
      properties: {
        ...feature.properties,
        incidence,

      },
    };
  });
};

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
    case SUCCESS_SAVE_DRAFT:
      return {
        ...action.data,
      };
    case SUCCESS_EXISTING:
      return action.data;
    case CLEAR:
      return initialState;
    case SUCCESS_POST_FEATURE:
      return {
        ...state,
        geojson: {
          ...state.geojson,
          features: getFeaturesWithIncidence(action.data, state.geojson.features),
        },
      };

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
    endpoint: `/userrequest/${data.id ? `${data.id}/` : ''}`,
    types: [SUBMIT_DATA, SUCCESS_SUBMIT_DATA, FAILURE_SUBMIT_DATA],
    config: {
      method: data.id ? 'PUT' : 'POST',
      body: JSON.stringify({
        ...data,
        state: 200, // SUBMITTED
      }),
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

/**
 * userrequest action : save userrequest as draft
 * @param {string} data
 */
export const saveDraft = data => ({
  [CALL_API]: {
    endpoint: `/userrequest/${data.id ? `${data.id}/` : ''}`,
    types: [SAVE_DRAFT, SUCCESS_SAVE_DRAFT, FAILURE_SAVE_DRAFT],
    config: {
      method: data.id ? 'PUT' : 'POST',
      body: JSON.stringify(data),
    },
    form: 'userrequest',
  },
});

/**
 * Post feature object
 * @param  {object} feature : feature sent to the server
 * @param  {date} eventDateStart : Event start date
 * @param  {date} eventDateEnd : Event end date
 */
export const getIntersections = (feature, eventDateStart, eventDateEnd) =>

  ({
    [CALL_API]: {
      endpoint: '/layer/reference/intersects/',
      types: [POST_FEATURE, SUCCESS_POST_FEATURE, FAILURE_POST_FEATURE],
      config: {
        method: 'POST',
        body: JSON.stringify({
          callbackid: feature.properties.id,
          from: eventDateStart,
          to: eventDateEnd,
          geom: JSON.stringify(feature.geometry),
        }),
      },
    },
  });
