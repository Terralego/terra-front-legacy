import { createSelector } from 'reselect';
import moment from 'moment';
import { CALL_API } from 'middlewares/api';

export const REQUEST_ALL = 'userrequestComments/REQUEST_ALL';
export const SUCCESS_ALL = 'userrequestComments/SUCCESS_ALL';
export const FAILURE_ALL = 'userrequestComments/FAILURE_ALL';
export const SUBMIT = 'userrequestComments/SUBMIT';
export const SUBMIT_SUCCESS = 'userrequestComments/SUBMIT_SUCCESS';
export const SUBMIT_FAILED = 'userrequestComments/SUBMIT_FAILED';

const initialState = {
  comments: {}, // comments by userrequestId
  loading: false, // loading comments list
  text: '',
  is_internal: false,
};

const getCommentAuthor = ({ groups, properties: { firstname, lastname } }) => {
  if (groups[0] === 'N1') {
    return 'Agent de terrain';
  }

  if (groups[0] === 'N2') {
    return 'Agent ONF';
  }

  return `${firstname} ${lastname}`;
};

const getCommentData = data => ({
  content: data.properties.comment,
  date: data.created_at,
  author: getCommentAuthor(data.owner),
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
    case REQUEST_ALL:
      return {
        ...state,
        loading: true,
      };
    case SUCCESS_ALL:
      return {
        ...state,
        loading: false,
        fetched: true,
        comments: {
          ...state.comments,
          ...parseCommentsByUserrequest(action.data),
        },
      };
    case FAILURE_ALL:
      return {
        ...state,
        fetched: true,
      };
    case SUBMIT:
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
    case SUBMIT_FAILED:
      return {
        ...state,
        error: action.error,
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
  items => Object.keys(items).map(key => items[key]).sort(sortByDate),
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
    type: SUCCESS_ALL,
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
    endpoint: `/userrequest/${userrequestId}/comment`,
    types: [REQUEST_ALL, SUCCESS_ALL, FAILURE_ALL],
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
    types: [SUBMIT, SUBMIT_SUCCESS, SUBMIT_FAILED],
    config: {
      method: 'POST',
      body: JSON.stringify({
        properties: { comment },
        is_internal: isInternal,
      }),
    },
    form: 'userrequestComments',
  },
});
