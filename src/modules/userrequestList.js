import { createSelector } from 'reselect';
import { combineReducers } from 'redux';
import { CALL_API } from 'middlewares/api';
import settings from 'front-settings';
import { SUBMIT_SUCCESS, SAVE_DRAFT_SUCCESS } from 'modules/userrequest';
import { getUserGroup } from 'modules/authentication';
import createPaginator, { getCurrentPageResults } from 'modules/pagination';

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

// const initialState = {
//   items: {},
//   loading: false,
//   // pagination: {
//   //   count: 0,
//   //   next: null,
//   //   previous: null,
//   // },
//   lastFetched: 0,
// };

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
    // case ALL_REQUEST:
    //   return {
    //     ...state,
    //     loading: true,
    //   };
    // case PAGE_SUCCESS:
    //   return {
    //     ...state,
    //     loading: false,
    //     items: getItemsFromResponse(action.data),
    //     // pagination: {
    //     //   count: action.data.count,
    //     //   next: action.data.next,
    //     //   previous: action.data.previous,
    //     // },
    //     lastFetched: Date.now(),
    //   };
    // case DETAIL_REQUEST:
    //   return {
    //     ...state,
    //     loading: true,
    //   };
    // case DETAIL_SUCCESS:
    // case SUBMIT_SUCCESS:
    // case SAVE_DRAFT_SUCCESS:
    //   return {
    //     ...state,
    //     loading: false,
    //     items: {
    //       ...state.items,
    //       [action.data.id]: action.data,
    //     },
    //   };
    // case STATE_CHANGE_SUCCESS:
    // case APPROBATIONS_CHANGE_SUCCESS:
    //   return {
    //     ...state,
    //     items: {
    //       ...state.items,
    //       [action.data.id]: action.data,
    //     },
    //   };
    // case DETAIL_FAILURE:
    //   return {
    //     ...state,
    //     items: {
    //       ...state.items,
    //       [getItemIdFromUrl(action.error.url)]: {
    //         error: action.error,
    //       },
    //     },
    //   };
    default:
      return userrequestPaginator.itemsReducer(state, action);
  }
};

export default userrequestList;

export const requestUserrequestPage = userrequestPaginator.requestPage;

/**
 * SELECTORS
 * --------------------------------------------------------- *
 */

/**
 * getUserrequestsByUser selector
 * @param {object} items
 * @param {string} userGroup
 * @param {number} draftStatus
 * @returns {array} array of userrequest without draft if N1 or N2
 */
const getUserrequestsByUser = (items, userGroup, draftStatus) => {
  const userrequestArray = items.filter(item => !item.error);
  if (userGroup === 'N1' || userGroup === 'N2') {
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
  state => getCurrentPageResults(
    state.userrequestList,
    state.pagination.userrequestList,
    '/userrequest/',
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
    getUserGroup,
    getDraftStatus,
  ],
  (items, userGroup, draftStatus) => getUserrequestsByUser(items, userGroup, draftStatus),
);


/**
 * ACTIONS
 * --------------------------------------------------------- *
 */

/**
 * abortRequest call when data is fresh, no need to perform new request
 */
export const abortRequest = () => ({
  type: ALL_ABORT_REQUEST,
});

/**
 * userrequestList action : fetch userrequest list
 *
 * @param limit {number|string} page size (max items per page)
 * @param page {number|string} page number
 */
export const fetchUserrequestList = (limit = settings.PAGE_SIZE, page = 1) => ({
  [CALL_API]: {
    endpoint: `/userrequest/?limit=${limit}&page=${page}`,
    types: [ALL_REQUEST, ALL_SUCCESS, ALL_FAILURE],
    config: { method: 'GET' },
  },
});

/**
 * updateUserrequestList is called every time we wan't userrequest list data
 * it's check last fetch date and if data is stale, dispatch fetchUserrequestList action
 *
 * @param limit {number|string} page size (max items per page)
 * @param page {number|string} page number
 */
export const updateUserrequestList = (limit = settings.PAGE_SIZE, page = 1) => (
  (dispatch, getState) => {
    // Get the last fetched date
    const timeSinceLastFetch = getState().userrequestList.lastFetched;
    // perform the async call if the data is older than the allowed limit
    const isDataStale = Date.now() - timeSinceLastFetch > settings.TIME_TO_STALE;

    if (isDataStale) {
      return dispatch(fetchUserrequestList(limit, page));
    }
    return dispatch(abortRequest());
  }
);

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
 * @param {object} userrequest - data we want to change the approbation
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
 * @param {object} userrequest - data we want to change the approbation
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
