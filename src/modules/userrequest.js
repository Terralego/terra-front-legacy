import { actions } from 'react-redux-form';

import { CALL_API } from 'middlewares/api';
import { defaultHeaders } from 'services/apiService';
import {
  getFeaturesWithIncidence,
  removeRouteInProgressDatas,
  getRoutedFeatures,
  deleteFeatureWithRoute,
  guid,
} from 'helpers/userrequestHelpers';
import { getDataWithFeatureId } from 'helpers/mapHelpers';
import { DETAIL_SUCCESS } from 'modules/userrequestList';
import initialState from 'modules/userrequest-initial';

// Modify userrequest object action types
export const UPDATE_DATA_PROPERTIES = 'userrequest/UPDATE_DATA_PROPERTIES';
export const ADD_GEOJSON_FEATURE = 'userrequest/ADD_GEOJSON_FEATURE';
export const DELETE_GEOJSON_FEATURES = 'userrequest/DELETE_GEOJSON_FEATURES';

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

// Check if user request is readed
export const READ_REQUEST = 'userrequest/READ_REQUEST';
export const READ_SUCCESS = 'userrequest/READ_SUCCESS';
export const READ_FAILURE = 'userrequest/READ_FAILURE';

// Get routes actions types
export const ROUTING_REQUEST = 'userrequest/ROUTING_REQUEST';
export const ROUTING_SUCCESS = 'userrequest/ROUTING_SUCCESS';
export const ROUTING_FAILURE = 'userrequest/ROUTING_FAILURE';

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
            ...state.geojson.features.filter(feature => (
              feature.properties.id !== action.feature.properties.id
            )),
            action.feature,
          ],
        },
      };
    case DELETE_GEOJSON_FEATURES:
      return {
        ...state,
        geojson: {
          ...state.geojson,
          features: deleteFeatureWithRoute(state.geojson.features, action.featuresId),
        },
      };
    case SAVE_DRAFT_REQUEST:
      return {
        ...state,
        isSaving: true,
      };
    case SAVE_DRAFT_SUCCESS:
      return {
        ...state,
        redirection: `/manage-request/detail/${action.data.id}`,
        isSaving: false,
        ...getDataWithFeatureId(action.data),
      };
    case DETAIL_SUCCESS:
      return {
        isSaving: false,
        ...getDataWithFeatureId(action.data),
      };
    case SUBMIT_SUCCESS:
      return {
        ...state,
        expiry: action.data.expiry,
      };
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
    case ROUTING_SUCCESS:
      return {
        ...state,
        geojson: {
          ...state.geojson,
          features: getRoutedFeatures(
            state.geojson.features,
            action.data.request.callbackid,
            { geometry: JSON.parse(action.data.geom), type: 'Feature', id: guid() },
          ),
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
 * updateFeatures add or update an object of properties
 * @param  {object} properties : object of properties to add / update in userrequest object
 */
export const updateFeatures = feature => ({
  type: ADD_GEOJSON_FEATURE,
  feature,
});

/**
 * userrequest action
 * deleteFeaturesById delete given features
 * @param  {array} features : array of features id (string) to delete from geojson
 */
export const deleteFeaturesById = featuresId => ({
  type: DELETE_GEOJSON_FEATURES,
  featuresId,
});

/**
 * userrequest action
 * openDraft set already loaded userrequest in userrequest form
 */
export const openDraft = data => dispatch => {
  dispatch(actions.setInitial('userrequest'));
  return dispatch({
    type: DETAIL_SUCCESS,
    data,
  });
};


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
        ...removeRouteInProgressDatas(data),
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
        callbackid: feature.id,
        from: eventDateStart,
        to: eventDateEnd,
        geom: JSON.stringify(feature.geometry),
      }),
    },
  },
});

/**
 * Post feature object
 * @param  {object} feature : feature sent to the server
 */
export const getRouting = feature => ({
  [CALL_API]: {
    endpoint: '/layer/1/route/',
    types: [ROUTING_REQUEST, ROUTING_SUCCESS, ROUTING_FAILURE],
    config: {
      headers: defaultHeaders,
      method: 'POST',
      body: JSON.stringify({
        callbackid: feature.id,
        geom: JSON.stringify(feature.geometry),
      }),
    },
  },
});

export const readUserrequest = id => ({
  [CALL_API]: {
    endpoint: `/userrequest/${id}/read/`,
    types: [READ_REQUEST, READ_SUCCESS, READ_FAILURE],
    config: {
      method: 'GET',
      headers: defaultHeaders,
    },
  },
});
