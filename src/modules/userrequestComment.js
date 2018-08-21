import { CALL_API } from 'middlewares/api';
import { defaultHeaders } from 'services/apiService';

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

export const initialState = {
  geojson: {
    type: 'FeatureCollection',
    features: [],
  },
  attachment: null,
  properties: {
    comment: '',
  },
  is_internal: null,
  error: null,
  intersections: null,
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
    // case INTERSECT_REQUEST: {
    //   return {
    //     ...state,
    //     intersections: null,
    //   };
    // }
    case INTERSECT_SUCCESS:
      return {
        ...state,
        intersections: action.data,
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
