import { actions } from 'react-redux-form';

import { CALL_API } from 'middlewares/api';
import { defaultHeaders } from 'services/apiService';
import { getFeaturesWithIncidence } from 'helpers/userrequestHelpers';
import { DETAIL_SUCCESS } from 'modules/userrequestList';

import initialState from 'modules/userrequest-initial';

// Modify userrequest object action types
export const UPDATE_DATA_PROPERTIES = 'userrequest/UPDATE_DATA_PROPERTIES';
export const ADD_GEOJSON_FEATURE = 'userrequest/ADD_GEOJSON_FEATURE';
export const REMOVE_GEOJSON_FEATURE = 'userrequest/REMOVE_GEOJSON_FEATURE';

// Save draft userrequest actions types
export const SAVE_DRAFT_REQUEST = 'userrequest/SAVE_DRAFT_REQUEST';
export const SAVE_DRAFT_SUCCESS = 'userrequest/SAVE_DRAFT_SUCCESS';
export const SAVE_DRAFT_FAILURE = 'userrequest/SAVE_DRAFT_FAILURE';

// Submit userrequest actions types
export const SUBMIT_REQUEST = 'userrequest/SUBMIT_REQUEST';
export const SUBMIT_SUCCESS = 'userrequest/SUBMIT_SUCCESS';
export const SUBMIT_FAILURE = 'userrequest/SUBMIT_FAILURE';

// Get feature intersection actions types
export const INTERSECT_REQUEST = 'userrequest/INTERSECT_REQUEST';
export const INTERSECT_SUCCESS = 'userrequest/INTERSECT_SUCCESS';
export const INTERSECT_FAILURE = 'userrequest/INTERSECT_FAILURE';

// Reset form after submit success
export const RESET_FORM = 'userrequest/RESET_FORM';

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
    case ADD_GEOJSON_FEATURE:
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
    case REMOVE_GEOJSON_FEATURE:
      return {
        ...state,
        geojson: {
          ...state.geojson,
          features: state.geojson.features
            .filter(feature => feature.properties.id !== action.featureId),
        },
      };
    case SAVE_DRAFT_SUCCESS:
    case DETAIL_SUCCESS:
      return action.data;
    case SUBMIT_SUCCESS:
    case RESET_FORM:
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
  type: ADD_GEOJSON_FEATURE,
  feature,
});

/**
 * userrequest action
 * removeRequestFeature remove or update an object of properties
 * @param  {object} properties : object of properties to remove / update in userrequest object
 */
export const removeRequestFeature = featureId => ({
  type: REMOVE_GEOJSON_FEATURE,
  featureId,
});

/**
 * userrequest action
 * openDraft set already loaded userrequest in userrequest form
 */
export const openDraft = data => ({
  type: DETAIL_SUCCESS,
  data,
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
      headers: defaultHeaders,
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
 * userrequest action : save userrequest as draft
 * @param {string} data
 */
export const saveDraft = data => (dispatch, getState) => dispatch({
  [CALL_API]: {
    endpoint: `/userrequest/${data.id ? `${data.id}/` : ''}`,
    types: [SAVE_DRAFT_REQUEST, SAVE_DRAFT_SUCCESS, SAVE_DRAFT_FAILURE],
    config: {
      headers: defaultHeaders,
      method: data.id ? 'PUT' : 'POST',
      body: JSON.stringify({
        ...data,
        state: getState().appConfig.states.DRAFT,
      }),
    },
  },
});

/**
 * Post feature object
 * @param  {object} feature : feature sent to the server
 * @param  {date} eventDateStart : Event start date
 * @param  {date} eventDateEnd : Event end date
 */
export const getIntersections = (feature, eventDateStart, eventDateEnd) => ({
  [CALL_API]: {
    endpoint: '/layer/reference/intersects/',
    types: [INTERSECT_REQUEST, INTERSECT_SUCCESS, INTERSECT_FAILURE],
    config: {
      headers: defaultHeaders,
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
