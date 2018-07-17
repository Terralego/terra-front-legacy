import { combineReducers } from 'redux';
import { createSelector } from 'reselect';
import queryString from 'query-string';
import settings from 'front-settings';
import { CALL_API } from 'middlewares/api';
import pick from 'lodash.pick';

// Pages request actions
export const PAGE_REQUEST = 'pagination/PAGE_REQUEST';
export const PAGE_ABORT_REQUEST = 'pagination/PAGE_ABORT_REQUEST';
export const PAGE_SUCCESS = 'pagination/PAGE_SUCCESS';
export const PAGE_FAILURE = 'pagination/PAGE_FAILURE';


/**
 * HELPERS
 * --------------------------------------------------------- *
 */

/**
 * getQueryFingerprint returns a fingerprint to identify page request parameters
 * @param {string} limit : max results per page
 * @param {string} page : page number
 * @returns {string} a string composed of limit and page
 */
const getQueryFingerprint = (limit, page) => `limit=${limit}&page=${page}`;

/**
 * REDUCERS
 * --------------------------------------------------------- *
 */

export const paramsReducer = (state = {}, action = {}) => {
  const { type, data, params } = action;

  if (!params) {
    return state;
  }

  const { limit, page } = params;
  const queryFingerprint = getQueryFingerprint(limit, page);
  switch (type) {
    case PAGE_REQUEST:
      return {
        ...state,
        [queryFingerprint]: undefined,
      };
    case PAGE_SUCCESS:
      return {
        ...state,
        [queryFingerprint]: data.count,
      };
    default:
      return state;
  }
};

const pagesReducer = (state = {}, action = {}) => {
  switch (action.type) {
    case PAGE_REQUEST:
      return {
        ...state,
        [action.params.page]: {
          ids: [],
          fetching: true,
        },
      };
    case PAGE_SUCCESS:
      return {
        ...state,
        [action.params.page]: {
          ids: action.data.results.map(item => item.id),
          fetching: false,
        },
      };
    default:
      return state;
  }
};

const currentPageReducer = (state = 1, action = {}) => {
  switch (action.type) {
    case PAGE_REQUEST:
    case PAGE_ABORT_REQUEST:
      return action.params.page;
    default:
      return state;
  }
};

const itemsReducer = (state = {}, action = {}) => {
  const newItems = {};
  switch (action.type) {
    case PAGE_SUCCESS:
      action.data.results.forEach(item => {
        newItems[item.id] = item;
      });
      return {
        ...state,
        items: {
          ...state.items,
          ...newItems,
        },
      };
    default:
      return state;
  }
};

/**
 * ACTIONS
 * --------------------------------------------------------- *
 */

/**
 * abortRequest call when data is fresh, no need to perform new request
 */
export const abortRequest = (endpoint, params) => ({
  type: PAGE_ABORT_REQUEST,
  endpoint,
  params,
});

/**
 * fetchPage action : fetch requested page
 * @param {string} id
 */
export const fetchPage = (endpoint, params) => ({
  [CALL_API]: {
    types: [PAGE_REQUEST, PAGE_SUCCESS, PAGE_FAILURE],
    config: { method: 'GET' },
    endpoint,
    params,
  },
});

const getPageFromCache = (endpoint, params, pageLoaded) => (
  (dispatch, getState) => {
    const store = getState();
    // Get the last fetched date
    const timeSinceLastFetch = store.userrequestList.lastFetched;
    // // perform the async call if the data is older than the allowed limit
    const isDataStale = Date.now() - timeSinceLastFetch > settings.TIME_TO_STALE;

    if (isDataStale || !pageLoaded) {
      return dispatch(fetchPage(endpoint, params));
    }
    return dispatch(abortRequest(endpoint, params));
  }
);

/**
 * requestPage
 *
 * @param search {string} search query parameters
 */
const requestPage = (endpoint, search) => (
  (dispatch, getState) => {
    const store = getState();
    let params = {
      limit: settings.PAGE_SIZE,
      page: 1,
    };

    let pageLoaded = false;

    if (search !== '') {
      params = queryString.parse(search);
      pageLoaded = store.pagination.userrequestList.params[search.slice(1)];
    }
    return dispatch(getPageFromCache(endpoint, params, pageLoaded));
  }
);

/**
 * createPaginator
 * --------------------------------------------------------- *
 */
const initialState = {
  pages: {},
  currentPage: 1,
  params: {},
};

/**
 * createPaginator is used to create a pagination for any module / component
 * with a server-side pagination
 *
 * @param endpoint {string} name of paginated module
 * @returns {object} an object composed with current page options,
 * reducers (params, pages, currentPage, items), see above in REDUCERS
 */
const createPaginator = endpoint => {
  const onlyForEndpoint = reducer => (state = initialState, action = {}) =>
    (action.endpoint === endpoint ? reducer(state, action) : state);

  const reducer = onlyForEndpoint(combineReducers({
    pages: pagesReducer,
    currentPage: currentPageReducer,
    params: paramsReducer,
  }));

  return {
    requestPage,
    reducer,
    itemsReducer: onlyForEndpoint(itemsReducer),
  };
};

export default createPaginator;


/**
 * SELECTORS
 * --------------------------------------------------------- *
 */

/**
 * getCurrentPageResults returns items contains in requested page
 *
 * @param items {object} all loaded items
 * @param pagination {object} pagination object
 * @returns {array} array of requested items
 */
export const getCurrentPageResults = createSelector(
  [
    (_, pagination) => pagination.pages[pagination.currentPage],
    items => items,
  ],
  (currentPage, items) => (!currentPage ? [] : Object.values(pick(items || [], currentPage.ids))),
);

/**
 * getPaginationParams returns items contains in requested page
 *
 * @param pagination {object} pagination object
 * @param params {string} query parameters
 * @returns {object} query params and items per page count
 */
export const getPaginationParams = (pagination, params) => {
  const { limit, page } = queryString.parse(params);
  const queryFingerprint = getQueryFingerprint(limit, page);
  const count = pagination ? pagination.params[queryFingerprint] : 0;

  return {
    params: {
      limit: +limit || settings.PAGE_SIZE,
      page: +page || 1,
    },
    count,
  };
};

export const isCurrentPageFetching = pagination =>
  (pagination.pages[pagination.currentPage] || { fetching: true }).fetching;

