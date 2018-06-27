import { actions } from 'react-redux-form';

import { CALL_API } from 'middlewares/api';

import initialState from 'modules/userrequest-initial';

// Modify userrequest object action types
export const UPDATE_DATA_PROPERTIES = 'userrequest/UPDATE_DATA_PROPERTIES';
export const ADD_GEOSJON_FEATURE = 'userrequest/ADD_GEOSJON_FEATURE';
export const REMOVE_GEOSJON_FEATURE = 'userrequest/REMOVE_GEOSJON_FEATURE';

// Save draft userrequest actions types
export const SAVE_DRAFT_REQUEST = 'userrequest/SAVE_DRAFT_REQUEST';
export const SAVE_DRAFT_SUCCESS = 'userrequest/SAVE_DRAFT_SUCCESS';
export const SAVE_DRAFT_FAILED = 'userrequest/SAVE_DRAFT_FAILED';

// Submit userrequest actions types
export const SUBMIT_REQUEST = 'userrequest/SUBMIT_REQUEST';
export const SUBMIT_SUCCESS = 'userrequest/SUBMIT_SUCCESS';
export const SUBMIT_FAILURE = 'userrequest/SUBMIT_FAILURE';

// Get draft request actions types
export const EXISTING_REQUEST = 'userrequest/EXISTING_REQUEST';
export const EXISTING_SUCCESS = 'userrequest/EXISTING_SUCCESS';
export const EXISTING_FAILURE = 'userrequest/EXISTING_FAILURE';

// Get feature intersection actions types
export const INTERSECT_REQUEST = 'userrequest/INTERSECT_REQUEST';
export const INTERSECT_SUCCESS = 'userrequest/INTERSECT_SUCCESS';
export const INTERSECT_FAILURE = 'userrequest/INTERSECT_FAILURE';

// Reset form after sumit success
export const RESET_FORM = 'userrequest/RESET_FORM';

/**
 * Creation of an initial gricode equal to zero, while mapping through the features
 * collection this gridcode will be increased each time we meet a more restrictive gridcode.
 * We finally return the most restrictive gridcode.
 *
 * @param  {object} response : response sent back after the post of the feature
 * @param  {Array} features : the feature, we want obtain the gridcode
 * @return {Array} the feature with this incidence
 */
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
    case SAVE_DRAFT_SUCCESS:
      return {
        ...action.data,
      };
    case EXISTING_SUCCESS:
      return action.data;
    case SUBMIT_SUCCESS:
      return initialState;
    case INTERSECT_SUCCESS:
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
 * resetForm restore form in its initial state with react-redux-form action
 * and clear userrequest data
 */
export const resetForm = () => dispatch => {
  dispatch(actions.setInitial('userrequest'));
  return dispatch({ type: RESET_FORM });
};

/**
 * Submit data object
 * @param  {object} data : data that will be send to the server
 */
export const submitData = (data, form = 'userrequest') => ({
  [CALL_API]: {
    endpoint: `/userrequest/${data.id ? `${data.id}/` : ''}`,
    types: [SUBMIT_REQUEST, SUBMIT_SUCCESS, SUBMIT_FAILURE],
    config: {
      method: data.id ? 'PUT' : 'POST',
      body: JSON.stringify({
        ...data,
        state: 200, // SUBMITTED
      }),
    },
    form,
  },
});

/**
 * userrequest action : fetch userrequest
 * @param {string} id
 */
export const fetchUserrequest = id => ({
  [CALL_API]: {
    endpoint: `/userrequest/${id}/`,
    types: [EXISTING_REQUEST, EXISTING_SUCCESS, EXISTING_FAILURE],
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
    types: [SAVE_DRAFT_REQUEST, SAVE_DRAFT_SUCCESS, SAVE_DRAFT_FAILED],
    config: {
      method: data.id ? 'PUT' : 'POST',
      body: JSON.stringify(data),
    },
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
      types: [INTERSECT_REQUEST, INTERSECT_SUCCESS, INTERSECT_FAILURE],
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
