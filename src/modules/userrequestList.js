import { createSelector } from 'reselect';

import { CALL_API } from 'middlewares/api';
import { SUBMIT_REQUEST } from 'modules/userrequest';

// Load all userrequest
export const ALL_REQUEST = 'userrequestList/ALL_REQUEST';
export const ALL_SUCCESS = 'userrequestList/ALL_SUCCESS';
export const ALL_FAILURE = 'userrequestList/ALL_FAILURE';

// Load userrequest detail
export const DETAIL_REQUEST = 'userrequestList/DETAIL_REQUEST';
export const DETAIL_SUCCESS = 'userrequestList/DETAIL_SUCCESS';
export const DETAIL_FAILURE = 'userrequestList/DETAIL_FAILURE';

// Change userrequest status
export const STATE_CHANGE_REQUEST = 'userrequestList/STATE_CHANGE_REQUEST';
export const STATE_CHANGE_SUCCESS = 'userrequestList/STATE_CHANGE_SUCCESS';
export const STATE_CHANGE_FAILURE = 'userrequestList/STATE_CHANGE_FAILURE';

// Change userrequest status
export const APPROBATIONS_CHANGE_REQUEST = 'userrequestList/APPROBATIONS_CHANGE_REQUEST';
export const APPROBATIONS_CHANGE_SUCCESS = 'userrequestList/APPROBATIONS_CHANGE_SUCCESS';
export const APPROBATIONS_CHANGE_FAILURE = 'userrequestList/APPROBATIONS_CHANGE_FAILURE';

const initialState = {
  items: {},
  loading: false,
};

/**
 * Get userrequests object with id keys
 *
 * @param  {object} response: response from get all request
 * @return {object} object of userrequests by id
 */
function getItemsFromResponse (response) {
  if (!response.results || response.results.length < 1) {
    return null;
  }
  const items = {};
  response.results.forEach(userrequest => {
    items[userrequest.id] = userrequest;
  });
  return items;
}

/**
 * Get the userrequest id
 *
 * @param  {string} url: url of detail userrequest
 * @return {string} item id
 */
function getItemIdFromUrl (url) {
  return url.split('/').reverse()[1];
}

/**
 * userrequestList reducer
 */
const userrequestList = (state = initialState, action) => {
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
        items: getItemsFromResponse(action.data),
      };
    case DETAIL_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case DETAIL_SUCCESS:
    case SUBMIT_REQUEST:
      return {
        ...state,
        loading: false,
        items: {
          ...state.items,
          [action.data.id]: action.data,
        },
      };
    case STATE_CHANGE_SUCCESS:
    case APPROBATIONS_CHANGE_SUCCESS:
      return {
        ...state,
        items: {
          ...state.items,
          [action.data.id]: action.data,
        },
      };
    case DETAIL_FAILURE:
      return {
        ...state,
        items: {
          ...state.items,
          [getItemIdFromUrl(action.error.url)]: {
            error: action.error,
          },
        },
      };
    default:
      return state;
  }
};

export default userrequestList;

/**
 * SELECTORS
 * --------------------------------------------------------- *
 */

/**
 * getUserrequestsArray selector
 * @param {object} state
 * @returns {array} array of userrequest without errored items
 */
export const getUserrequestsArray = createSelector(
  state => state.userrequestList.items,
  items => Object.keys(items).map(key => items[key]).filter(item => !item.error),
);


/**
 * ACTIONS
 * --------------------------------------------------------- *
 */

/**
 * userrequestList action : fetch userrequest list
 */
export const fetchUserrequestList = () => ({
  [CALL_API]: {
    endpoint: '/userrequest/',
    types: [ALL_REQUEST, ALL_SUCCESS, ALL_FAILURE],
    config: { method: 'GET' },
  },
});

/**
 * userrequest action : fetch userrequest
 * @param {string} id
 */
export const fetchUserrequest = id => ({
  [CALL_API]: {
    endpoint: `/userrequest/${id}/`,
    types: [DETAIL_REQUEST, DETAIL_SUCCESS, DETAIL_FAILURE],
    config: { method: 'GET' },
  },
});

/**
 * userrequest action : update state of a userrequest
 * @param {number} id - id of the userrequest
 * @param {number} state - state of the userrequest
 */
export const updateState = (id, state) => ({
  [CALL_API]: {
    endpoint: `/userrequest/${id}/`,
    types: [STATE_CHANGE_REQUEST, STATE_CHANGE_SUCCESS, STATE_CHANGE_FAILURE],
    config: {
      method: 'PATCH',
      body: JSON.stringify({
        state,
      }),
    },
  },
});

/**
 * updateStateAndApprobations action : update state of a userrequest
 * @param {object} userrequest - data that we wan't change approbations
 * @param {number} status - N2 approbation status
 * @param {string} userUuid - uuid of N1 that request approbation
 */
export const updateStateAndApprobation = (data, status, userUuid) => ({
  [CALL_API]: {
    endpoint: `/userrequest/${data.id}/`,
    types: [STATE_CHANGE_REQUEST, STATE_CHANGE_SUCCESS, STATE_CHANGE_FAILURE],
    config: {
      method: 'PATCH',
      body: JSON.stringify({
        state: status,
        properties: {
          ...data.properties,
          approbations: {
            ...data.properties.approbations,
            [userUuid]: status,
          },
        },
      }),
    },
  },
});

/**
 * userrequest action : update approbation status from N1 user
 * @param {object} userrequest - data that we wan't change approbations
 * @param {number} status - N1 approbation status
 * @param {string} userUuid - uuid of N1 that request approbation
 */
export const updateApprobation = (data, status, userUuid) => ({
  [CALL_API]: {
    endpoint: `/userrequest/${data.id}/`,
    types: [APPROBATIONS_CHANGE_REQUEST, APPROBATIONS_CHANGE_SUCCESS, APPROBATIONS_CHANGE_FAILURE],
    config: {
      method: 'PATCH',
      body: JSON.stringify({
        properties: {
          ...data.properties,
          approbations: {
            ...data.properties.approbations,
            [userUuid]: status,
          },
        },
      }),
    },
  },
});
