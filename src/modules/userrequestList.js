import { createSelector } from 'reselect';

import { CALL_API } from 'middlewares/api';
import { defaultHeaders } from 'services/apiService';

import { SUBMIT_SUCCESS, SAVE_DRAFT_SUCCESS, READ_SUCCESS } from 'modules/userrequest';
import { getUserGroups } from 'modules/authentication';
import createPaginator, { getCurrentPageResults, PAGE_SUCCESS } from 'modules/pagination';
import { hasGroup } from 'helpers/permissionsHelpers';
import { getDataWithFeatureId } from 'helpers/mapHelpers';

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

export const userrequestPaginator = createPaginator('/userrequest/');

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
const userrequestList = (state = {}, action) => {
  switch (action.type) {
    case PAGE_SUCCESS:
      return {
        ...userrequestPaginator.itemsReducer(state, action),
      };
    case DETAIL_REQUEST:
      return {
        ...state,
      };
    case DETAIL_SUCCESS:
    case SUBMIT_SUCCESS:
    case READ_SUCCESS:
    case SAVE_DRAFT_SUCCESS:
      return {
        ...state,
        [action.data.id]: getDataWithFeatureId(action.data),
      };
    case STATE_CHANGE_SUCCESS:
      return {
        ...state,
        [action.data.id]: action.data,
      };
    case STATE_CHANGE_FAILURE:
      return {
        ...state,
        [action.data.id]: action.data,
      };
    case STATE_CHANGE_REQUEST:
      return {
        ...state,
        [action.endpoint.split('/').reverse()[1]]: {
          ...state[action.endpoint.split('/').reverse()[1]],
          isLoading: true,
        },
      };
    case APPROBATIONS_CHANGE_SUCCESS:
      return {
        ...state,
        [action.data.id]: action.data,
      };
    case DETAIL_FAILURE:
      return {
        ...state,
        [getItemIdFromUrl(action.error.url)]: {
          error: action.error,
        },
      };
    default:
      return userrequestPaginator.itemsReducer(state, action);
  }
};

export default userrequestList;

/**
 * SELECTORS
 * --------------------------------------------------------- *
 */

/**
 * getUserrequestsByUser selector
 * @param {object} items
 * @param {number} draftStatus
 * @param {array} groups
 * @returns {array} array of userrequest without draft if N1 or N2
 */
const getUserrequestsByUser = (items, draftStatus, groups) => {
  const userrequestArray = items.filter(item => !item.error);
  if (hasGroup(groups, 'staff')) {
    return userrequestArray.filter(userrequest => userrequest.state !== draftStatus);
  }

  return userrequestArray;
};

const getDraftStatus = createSelector(
  state => state.appConfig.states.DRAFT,
  draftStatus => draftStatus,
);

export const getUserrequestArray = createSelector(
  state => state,
  (_, query) => query,
  (state, query) => getCurrentPageResults(
    state.pagination.userrequestList,
    query,
    state.userrequestList,
  ),
);

/**
 * getUserrequestsArray selector
 * @param {object} state
 * @returns {array} array of userrequest without erroneous items
 */
export const getUserrequestsArrayFilteredByUser = createSelector(
  [
    getUserrequestArray,
    getDraftStatus,
    getUserGroups,
  ],
  (items, draftStatus, groups) => getUserrequestsByUser(items, draftStatus, groups),
);


/**
 * ACTIONS
 * --------------------------------------------------------- *
 */

/**
 * requestUserrequestPage
 *
 * @param search {string} search query parameters
 */
export const requestUserrequestPage = search => userrequestPaginator.requestPage('/userrequest/', search, 'userrequestList');

/**
 * userrequest action : fetch userrequest
 * @param {string} id
 */
export const fetchUserrequest = id => ({
  [CALL_API]: {
    endpoint: `/userrequest/${id}/`,
    types: [DETAIL_REQUEST, DETAIL_SUCCESS, DETAIL_FAILURE],
    config: {
      headers: defaultHeaders,
    },
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
      headers: defaultHeaders,
      method: 'PATCH',
      body: JSON.stringify({
        state,
      }),
    },
  },
});

/**
 * updateStateAndApprobations action : update state of a userrequest
 * @param {object} userrequest - data we want to change the approbation
 * @param {number} status - N2 approbation status
 * @param {string} userUuid - uuid of N1 that request approbation
 */
export const updateStateAndApprobation = (data, status, userUuid) => ({
  [CALL_API]: {
    endpoint: `/userrequest/${data.id}/`,
    types: [STATE_CHANGE_REQUEST, STATE_CHANGE_SUCCESS, STATE_CHANGE_FAILURE],
    config: {
      headers: defaultHeaders,
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
 * @param {object} userrequest - data we want to change the approbation
 * @param {number} status - N1 approbation status
 * @param {string} userUuid - uuid of N1 that request approbation
 */
export const updateApprobation = (data, status, userUuid) => ({
  [CALL_API]: {
    endpoint: `/userrequest/${data.id}/`,
    types: [APPROBATIONS_CHANGE_REQUEST, APPROBATIONS_CHANGE_SUCCESS, APPROBATIONS_CHANGE_FAILURE],
    config: {
      headers: defaultHeaders,
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
