import { actions } from 'react-redux-form';

import { CALL_API } from 'middlewares/api';
import apiService, { defaultHeaders } from 'services/apiService';
import {
  getFeaturesWithIncidence,
  removeRouteInProgressDatas,
  getRoutedFeatures,
  deleteFeatureWithRoute,
} from 'helpers/userrequestHelpers';
import { getDataWithFeatureId } from 'helpers/mapHelpers';
import { insertUserrequest, DETAIL_SUCCESS } from 'modules/userrequestList';
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

// Set new datas to the initial userrequest
export const CHANGE_USERREQUEST_DATA_MAP = 'CHANGE_USERREQUEST_DATA_MAP';

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
        isSaving: 'draft',
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
        ...state,
        isSaving: false,
        ...getDataWithFeatureId(action.data),
      };
    case SAVE_DRAFT_FAILURE:
      return {
        ...state,
        isSaving: false,
      };
    case SUBMIT_REQUEST:
      return {
        ...state,
        isSaving: true,
      };
    case SUBMIT_SUCCESS:
      return {
        ...state,
        expiry: action.data.expiry,
        isSaving: false,
      };
    case SUBMIT_FAILURE:
      return {
        ...state,
        isSaving: false,
      };
    case RESET_FORM:
      return initialState;
    case INTERSECT_SUCCESS: {
      const currentFeature = state.geojson.features
        .find(feature => feature.id === action.data.request.callbackid);

      return {
        ...state,
        geojson: {
          ...state.geojson,
          features: getFeaturesWithIncidence(
            action.data,
            state.geojson.features,
            state.properties.activities[currentFeature.properties.activity].eventDates,
          ),
        },
      };
    }
    case ROUTING_SUCCESS:
      return {
        ...state,
        geojson: {
          ...state.geojson,
          features: getRoutedFeatures(
            state.geojson.features,
            action.data.request.callbackid,
            action.data.geom.features,
          ),
        },
      };
    case CHANGE_USERREQUEST_DATA_MAP:
      return {
        ...state,
        geojson: {
          ...state.geojson,
          features: [
            ...state.geojson.features.filter(feature =>
              feature.properties.activity !== action.features[0].properties.activity),
            ...action.features,
          ],
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
  dispatch(actions.reset('userrequest'));
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
export const resetForm = ({ full } = {}) => dispatch => {
  dispatch(actions.reset('userrequest'));
  if (full) {
    dispatch({ type: RESET_FORM });
  }
};

function saveRequest (body) {
  return apiService.request(`/userrequest/${body.id ? `${body.id}/` : ''}`, {
    headers: defaultHeaders,
    method: body.id ? 'PUT' : 'POST',
    body: JSON.stringify(body),
  });
}

/**
 * Submit data object
 * @param  {object} data : data that will be send to the server
 */
export const submitData = ({ draft, data: requestData } = {}) => async (dispatch, getState) => {
  const data = requestData || getState().userrequest;
  dispatch(actions.setPending('userrequest', true));

  dispatch({ type: draft ? SAVE_DRAFT_REQUEST : SUBMIT_REQUEST });

  const bodyData = draft
    ? data
    : removeRouteInProgressDatas(data);

  try {
    const { data: savedData } = await saveRequest({
      ...bodyData,
      state: draft ? getState().appConfig.states.DRAFT : 200,
    });
    dispatch({ type: draft ? SAVE_DRAFT_SUCCESS : SUBMIT_SUCCESS, data: savedData });

    if (!draft) {
      dispatch(actions.setSubmitted('userrequest', true));
    }
  } catch (e) {
    dispatch({ type: draft ? SAVE_DRAFT_FAILURE : SUBMIT_FAILURE });
  }

  if (draft) {
    dispatch(actions.setPending('userrequest', false));
  }
};

/**
 * userrequest action : save userrequest as draft
 * @param {string} data
 */
export const saveDraft = () => submitData({ draft: true });

export const changeMapUserrequest = () => (dispatch, getState) => {
  const { userrequestComment: { properties, geojson } } = getState();
  const activityToChange = properties.selectedActivityUid;
  const features = [
    ...geojson.features.map(feature =>
      ({ ...feature, properties: { ...feature.properties, activity: activityToChange } })),
  ];

  dispatch({
    type: CHANGE_USERREQUEST_DATA_MAP,
    features,
  });
};

/**
 * Duplicate one or many userrequest
 * @param {mixed} items Object or array of objects containing:
 * * item: {Object} userrequest resource
 * * title: {String} New item title template. Can take a "{{title}}" placeholder
 */
export const duplicate = (items, afterInserted = () => null) => async (dispatch, getState) => {
  const itemsList = Array.isArray(items) ? items : [items];
  try {
    await Promise.all(itemsList.map(async ({ item, title }) => {
      const copyData = { ...item };
      delete copyData.id;
      const copyTitle = title.replace('{{title}}', item.properties.title);
      copyData.properties.title = copyTitle;

      try {
        const { data: savedData } = await saveRequest({
          ...copyData,
          state: getState().appConfig.states.DRAFT,
        });
        dispatch(insertUserrequest(savedData, 0));
      } catch (e) {
        //
      }
    }));
    afterInserted();
  } catch (e) {
    //
  }
};

/**
 * Post feature object
 * @param  {object} feature : feature sent to the server
 */
export const getIntersections = feature => ({
  [CALL_API]: {
    endpoint: '/layer/hors_chemins/intersects/',
    types: [INTERSECT_REQUEST, INTERSECT_SUCCESS, INTERSECT_FAILURE],
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
