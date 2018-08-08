import { CALL_API } from 'middlewares/api';

export const SUBMIT_REQUEST = 'userrequestComment/SUBMIT_REQUEST';
export const SUBMIT_SUCCESS = 'userrequestComment/SUBMIT_SUCCESS';
export const SUBMIT_FAILURE = 'userrequestComment/SUBMIT_FAILURE';

export const GEOJSON_COMMENT_FEATURE_ADD = 'GEOJSON_COMMENT_FEATURE_ADD';
export const GEOJSON_COMMENT_FEATURE_REMOVE = 'GEOJSON_COMMENT_FEATURE_REMOVE';
export const GEOJSON_COMMENT_NEW_FEATURE_REMOVE = 'GEOJSON_COMMENT_NEW_FEATURE_REMOVE';

export const COMMENT_ATTACHMENT_ADD = 'COMMENT_ATTACHMENT_ADD';
export const COMMENT_ATTACHMENT_REMOVE = 'COMMENT_ATTACHMENT_REMOVE';

const initialState = {
  geojson: {
    type: 'FeatureCollection',
    features: [],
  },
  attachment: null,
  properties: {
    comment: '',
  },
  is_internal: null,
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
        submitted: true,
        sent: false,
        error: null,
      };
    case SUBMIT_SUCCESS:
      return initialState;
    case SUBMIT_FAILURE:
      return {
        ...state,
        error: action.error,
      };
    case GEOJSON_COMMENT_FEATURE_ADD:
      return {
        ...state,
        geojson: {
          ...state.geojson,
          features: [
            ...action.feature,
          ],
        },
      };
    case GEOJSON_COMMENT_FEATURE_REMOVE:
      return {
        ...state,
        geojson: {
          ...state.geojson,
          features: state.geojson.features
            .filter(feature => feature.properties.id !== action.featureId),
        },
      };
    case GEOJSON_COMMENT_NEW_FEATURE_REMOVE:
      return {
        ...state,
        geojson: {
          ...state.geojson,
          features: [],
        },
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
export const submitComment = (userrequestId, data, isInternal) => {
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
 * add GEOJSON RequestCommentFeature add or update an object of properties
 * @param {object} properties : object of properties to add / update in userrequestComment object
 */
export const addRequestCommentFeature = feature => ({
  type: GEOJSON_COMMENT_FEATURE_ADD,
  feature,
});

/**
* userrequestComment action
* add GEOJSON RequestCommentFeature add or update an object of properties
 * @param {object} properties : object of properties to remove / update in userrequestComment object
 */
export const removeRequestCommentFeature = featureId => ({
  type: GEOJSON_COMMENT_FEATURE_REMOVE,
  featureId,
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
