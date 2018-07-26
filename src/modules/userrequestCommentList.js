import { createSelector } from 'reselect';
import moment from 'moment';
import { CALL_API } from 'middlewares/api';
import { defaultHeaders } from 'services/apiService';
import { SUBMIT_SUCCESS } from 'modules/userrequestComment';

export const ALL_REQUEST = 'userrequestCommentList/ALL_REQUEST';
export const ALL_SUCCESS = 'userrequestCommentList/ALL_SUCCESS';
export const ALL_FAILURE = 'userrequestCommentList/ALL_FAILURE';

const initialState = {
  items: {}, // comments by userrequestId
  loading: false, // loading comments list
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
  geojson: data.geojson,
  attachment: data.filename ? {
    url: data.attachment_url,
    name: data.filename,
  } : null,
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
const userrequestCommentList = (state = initialState, action) => {
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
        items: {
          ...state.comments,
          ...parseCommentsByUserrequest(action.data),
        },
      };
    case ALL_FAILURE:
      return {
        ...state,
        fetched: true,
      };
    case SUBMIT_SUCCESS:
      return {
        ...state,
        items: {
          ...state.items,
          [action.data.userrequest]: {
            ...state.items[action.data.userrequest],
            [action.data.id]: getCommentData(action.data),
          },
        },
      };
    default:
      return state;
  }
};

export default userrequestCommentList;

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
  (state, userrequestId) => state.userrequestCommentList.items[userrequestId] || {},
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
      headers: defaultHeaders,
    },
  },
});
