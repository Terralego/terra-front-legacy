import { createSelector } from 'reselect';
import moment from 'moment';
import { CALL_API } from 'middlewares/api';

export const ALL_REQUEST = 'userrequestComments/ALL_REQUEST';
export const ALL_SUCCESS = 'userrequestComments/ALL_SUCCESS';
export const ALL_FAILURE = 'userrequestComments/ALL_FAILURE';

export const SUBMIT_REQUEST = 'userrequestComments/SUBMIT_REQUEST';
export const SUBMIT_SUCCESS = 'userrequestComments/SUBMIT_SUCCESS';
export const SUBMIT_FAILURE = 'userrequestComments/SUBMIT_FAILURE';

export const GEOJSON_COMMENT_FEATURE_ADD = 'GEOJSON_COMMENT_FEATURE_ADD';
export const GEOJSON_COMMENT_FEATURE_REMOVE = 'GEOJSON_COMMENT_FEATURE_REMOVE';

const initialState = {
  geojson: {
    type: 'FeatureCollection',
    features: [],
  },
  attachments: {}, // Object contenant les futures pièces jointes
  comments: {}, // comments by userrequestId
  loading: false, // loading comments list
  text: '',
  is_internal: false,
};

const getCommentAuthor = ({ email, properties: { firstname, lastname } }) => {
  if (firstname && lastname) {
    return `${firstname} ${lastname}`;
  }

  return email;
};

const getCommentData = data => ({
  content: data.properties.comment,
  date: data.created_at,
  author: getCommentAuthor(data.owner),
  is_internal: data.is_internal,
});

const parseCommentsByUserrequest = response => {
  if (!response.results || response.results.length < 1) {
    return null;
  }
  const comments = {};
  const userrequestId = response.results[0].userrequest;
  response.results.forEach(userrequest => {
    comments[userrequest.id] = getCommentData(userrequest);
  });

  return { [userrequestId]: comments };
};

/**
 * REDUCER
 * --------------------------------------------------------- *
 */
const userrequestComments = (state = initialState, action) => {
  switch (action.type) {
    case ALL_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case ALL_SUCCESS:
      return {
        ...state,
        loading: false,
        fetched: true,
        comments: {
          ...state.comments,
          ...parseCommentsByUserrequest(action.data),
        },
      };
    case ALL_FAILURE:
      return {
        ...state,
        fetched: true,
      };
    case SUBMIT_REQUEST:
      return {
        ...state,
        submitted: true,
        sent: false,
        error: null,
      };
    case SUBMIT_SUCCESS:
      return {
        ...state,
        text: '',
        comments: {
          ...state.comments,
          [action.data.userrequest]: {
            ...state.comments[action.data.userrequest],
            [action.data.id]: getCommentData(action.data),
          },
        },
      };
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
            ...state.geojson.features,
            action.feature,
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
    default:
      return state;
  }
};

export default userrequestComments;

/**
 * SELECTORS
 * --------------------------------------------------------- *
 */

const sortByDate = (a, b) => moment(a.date).isBefore(b.date);

/**
 * getCommentsByUserrequest selector
 * @param {object} state
 * @param {string} userrequestId : id of userrequest
 * @returns {array} array of comments
 */
export const getCommentsByUserrequest = createSelector(
  (state, userrequestId) => state.userrequestComments.comments[userrequestId] || {},
  items => Object.values(items).sort(sortByDate),
);


/**
 * ACTIONS
 * --------------------------------------------------------- *
 */

/**
 * updateItems action : update items object
 * @param  {object} comments : object contains all userrequests, ordered by ids
 */
export const updateItems = (userrequestId, comments) => dispatch => {
  dispatch({
    type: ALL_SUCCESS,
    comments,
    userrequestId,
  });
};

/**
 * fetchUserrequestComments async action : fetch userrequest list if not loaded
 * @param {number} userrequestId
 */
export const fetchUserrequestComments = userrequestId => ({
  [CALL_API]: {
    endpoint: `/userrequest/${userrequestId}/comment/`,
    types: [ALL_REQUEST, ALL_SUCCESS, ALL_FAILURE],
    config: {
      method: 'GET',
    },
  },
});

/**
 * submitComment async action : post userrequest comment
 * @param {number} userrequestId
 * @param {string} new comment text
 */
export const submitComment = (userrequestId, comment, isInternal) => ({
  [CALL_API]: {
    endpoint: `/userrequest/${userrequestId}/comment/`,
    types: [SUBMIT_REQUEST, SUBMIT_SUCCESS, SUBMIT_FAILURE],
    config: {
      method: 'POST',
      body: JSON.stringify({
        properties: { comment: comment.text },
        is_internal: isInternal,
        geojson: { ...comment.geojson },
      }),
    },
    form: 'userrequestComments',
  },
});

/**
 * userrequestComments action
 * add GEOJSON RequestCommentFeature add or update an object of properties
 * @param {object} properties : object of properties to add / update in userrequestComment object
 */
export const addRequestCommentFeature = feature => ({
  type: GEOJSON_COMMENT_FEATURE_ADD,
  feature,
});

/**
* userrequestComments action
* add GEOJSON RequestCommentFeature add or update an object of properties
 * @param {object} properties : object of properties to remove / update in userrequestComment object
 */
export const removeRequestCommentFeature = featureId => ({
  type: GEOJSON_COMMENT_FEATURE_REMOVE,
  featureId,
});
