import { CALL_API } from 'middlewares/api';
import { defaultHeaders } from 'services/apiService';
import {
  getFeaturesWithIncidence,
  getRoutedFeatures,
  deleteFeatureWithRoute,
} from 'helpers/userrequestHelpers';

export const SUBMIT_REQUEST = 'userrequestComment/SUBMIT_REQUEST';
export const SUBMIT_SUCCESS = 'userrequestComment/SUBMIT_SUCCESS';
export const SUBMIT_FAILURE = 'userrequestComment/SUBMIT_FAILURE';

export const GEOJSON_COMMENT_FEATURE_UPDATE = 'GEOJSON_COMMENT_FEATURE_UPDATE';
export const GEOJSON_COMMENT_CLEAR = 'GEOJSON_COMMENT_CLEAR';

export const COMMENT_ATTACHMENT_ADD = 'COMMENT_ATTACHMENT_ADD';
export const COMMENT_ATTACHMENT_REMOVE = 'COMMENT_ATTACHMENT_REMOVE';

// Get feature intersection actions types
export const INTERSECT_REQUEST = 'userrequestComment/INTERSECT_REQUEST';
export const INTERSECT_SUCCESS = 'userrequestComment/INTERSECT_SUCCESS';
export const INTERSECT_FAILURE = 'userrequestComment/INTERSECT_FAILURE';

// Get LineString routing actions types
export const ROUTING_REQUEST = 'userrequestComment/ROUTING_REQUEST';
export const ROUTING_SUCCESS = 'userrequestComment/ROUTING_SUCCESS';
export const ROUTING_FAILURE = 'userrequestComment/ROUTING_FAILURE';

// Update or Delete geojson temp_features
export const UPDATE_TEMP_FEATURES = 'userrequestComment/UPDATE_TEMP_FEATURES';
export const DELETE_GEOJSON_TEMPFEATURES = 'userrequestComment/DELETE_GEOJSON_TEMPFEATURES';

// Set the current activity date
export const SET_USERREQUEST_ACTIVITIES = 'userrequestComment/SET_USERREQUEST_ACTIVITIES';

// Set current modale activity Id
export const SET_ACTIVITY_UID = 'SET_ACTIVITY_UID';

export const initialState = {
  geojson: {
    type: 'FeatureCollection',
    features: [],
  },
  attachment: null,
  properties: {
    comment: '',
    selectedActivityUid: 0,
  },
  is_internal: null,
  error: null,
  intersections: null,
  tempFeatures: [],
  activities: [],
};


/**
 * REDUCER
 * --------------------------------------------------------- *
 */
const userrequestComment = (state = initialState, action) => {
  switch (action.type) {
    case SUBMIT_REQUEST:
      return {
        ...state,
        error: null,
      };
    case SUBMIT_SUCCESS:
      return initialState;
    case SUBMIT_FAILURE:
      return {
        ...state,
        error: action.error,
      };
    case GEOJSON_COMMENT_FEATURE_UPDATE:
      return {
        ...state,
        geojson: {
          ...state.geojson,
          features: action.features,
        },
      };
    case GEOJSON_COMMENT_CLEAR:
      return {
        ...state,
        geojson: initialState.geojson,
        intersections: null,
      };
    case COMMENT_ATTACHMENT_ADD:
      return {
        ...state,
        attachment: action.attachment,
      };
    case COMMENT_ATTACHMENT_REMOVE:
      return {
        ...state,
        attachment: null,
      };
    case INTERSECT_SUCCESS:
      return {
        ...state,
        tempFeatures: getFeaturesWithIncidence(
          action.data,
          state.tempFeatures,
          state.activities[state.properties.selectedActivityUid].eventDates,
        ),
      };
    case UPDATE_TEMP_FEATURES:
      return {
        ...state,
        tempFeatures: action.features,
      };
    case DELETE_GEOJSON_TEMPFEATURES:
      return {
        ...state,
        tempFeatures: deleteFeatureWithRoute(state.tempFeatures, action.featuresId),
      };
    case ROUTING_SUCCESS:
      return {
        ...state,
        tempFeatures: getRoutedFeatures(
          state.tempFeatures,
          action.data.request.callbackid,
          action.data.geom.features,
        ),
      };
    case SET_USERREQUEST_ACTIVITIES:
      return {
        ...state,
        activities: [...action.activities],
      };
    case SET_ACTIVITY_UID:
      return {
        ...state,
        properties: {
          ...state.properties,
          selectedActivityUid: action.activityUid,
        },
      };
    default:
      return state;
  }
};

export default userrequestComment;

/**
 * SELECTORS
 * --------------------------------------------------------- *
 */


/**
 * ACTIONS
 * --------------------------------------------------------- *
 */

/**
 * submitComment async action : post userrequest comment
 * @param {number} userrequestId
 * @param {string} new comment text
 */
export const submitComment = (userrequestId = 0, data = initialState, isInternal = false) => {
  const body = new FormData();
  body.append('properties', JSON.stringify(data.properties));
  body.append('is_internal', isInternal);

  if (data.geojson.features.length) {
    body.append('geojson', JSON.stringify(data.geojson));
  }

  if (data.attachment) {
    body.append('attachment', data.attachment);
  }

  return ({
    [CALL_API]: {
      endpoint: `/userrequest/${userrequestId}/comment/`,
      types: [SUBMIT_REQUEST, SUBMIT_SUCCESS, SUBMIT_FAILURE],
      config: {
        method: 'POST',
        body,
      },
      form: 'userrequestComment',
    },
  });
};

/**
 * Post feature object
 * @param  {object} feature : feature sent to the server
 */
export const getRouting = feature => ({
  [CALL_API]: {
    endpoint: '/layer/chemins/route/',
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

/**
 * userrequest action
 * deleteFeaturesById delete given features
 * @param  {array} features : array of features id (string) to delete from geojson
 */
export const deleteCommentFeaturesById = featuresId => ({
  type: DELETE_GEOJSON_TEMPFEATURES,
  featuresId,
});

/**
 * userrequestComment action
 * add or update geojson feature
 * @param {array} features : array of features to add / update in userrequestComment object
 */
export const updateCommentFeature = features => ({
  type: GEOJSON_COMMENT_FEATURE_UPDATE,
  features,
});

/**
* userrequestComment action
* remove all geojson features
 */
export const clearGeojson = () => ({
  type: GEOJSON_COMMENT_CLEAR,
});

/**
 * userrequestComment action
 * add attachment
 * @param {object} properties: object of properties to add / update in userrequestComment object
 */
export const addAttachment = attachment => ({
  type: COMMENT_ATTACHMENT_ADD,
  attachment,
});

export const setActivities = activities => ({
  type: SET_USERREQUEST_ACTIVITIES,
  activities,
});

export const setActivityUid = activityUid => ({
  type: SET_ACTIVITY_UID,
  activityUid,
});

/**
 * userrequestComment action
 * remove attachment
 * @param {object} properties: object of properties to remove / update in userrequestComment object
 */
export const removeAttachment = attachmentUid => ({
  type: COMMENT_ATTACHMENT_REMOVE,
  attachmentUid,
});

/**
 * userrequestComment action
 * update temporal features when drawing
 * @param {array} features: array of features
 */
export const updateTempFeatures = features => ({
  type: UPDATE_TEMP_FEATURES,
  features,
});

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
