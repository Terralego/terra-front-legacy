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
const getQueryFingerprint = (limit, search) => {
  let query = `limit=${limit}`;
  if (search) {
    query += `&search=${search}`;
  }
  return query;
};

/**
 * getParams returns a an object with page and limit
 * @param {string} search : search parameters from url
 * @returns {object} params object
 */
const getParams = search => {
  const params = queryString.parse(search);
  return {
    limit: parseInt(params.limit, 10) || settings.PAGE_SIZE,
    page: parseInt(params.page, 10) || 1,
    search: params.search || '',
  };
};

/**
 * SELECTORS
 * --------------------------------------------------------- *
 */

export const getCurrentPages = (pagination = { queries: {} }, queries) => {
  const params = getParams(queries);
  const key = getQueryFingerprint(params.limit, params.search);
  return pagination.queries && pagination.queries[key] ? pagination.queries[key].pages : {};
};

export const getCurrentPage = (pagination, queryParams) =>
  getCurrentPages(pagination, queryParams)[pagination.currentPage || 1] || {};

/**
 * getCurrentPageResults returns items contains in requested page
 *
 * @param pagination {object} pagination object
 * @param queryParams {string}
 * @param items {object} all loaded items
 * @returns {array} array of requested items
 */
export const getCurrentPageResults = createSelector(
  [
    getCurrentPage,
    (pagination, queryParams, items) => items,
  ],
  (currentPage, items = []) => (
    currentPage.ids ? Object.values(pick(items, currentPage.ids)) : []
  ),
);

/**
 * getPaginationParams returns items contains in requested page
 *
 * @param pagination {object} pagination object
 * @param params {string} query parameters
 * @returns {object} query params and items per page count
 */
export const getPaginationParams = (pagination = { queries: {} }, queryParams) => {
  const { limit, page, search } = getParams(queryParams);
  const key = getQueryFingerprint(limit, search);
  const count = pagination.queries && pagination.queries[key] ? pagination.queries[key].count : 0;

  return {
    params: {
      limit: +limit,
      page: +page,
      search,
    },
    count,
  };
};

/**
 * isCurrentPageFetching returns loading state of current page
 *
 * @param pagination {object} pagination object
 * @param params {string} query parameters
 * @returns {boolean} fetched
 */
export const isCurrentPageFetching = createSelector(
  [getCurrentPage],
  currentPage => currentPage.fetching,
);


/**
 * REDUCERS
 * --------------------------------------------------------- *
 */

export const queriesReducer = (state = {}, action = {}) => {
  const { type, data, params } = action;

  if (!params) {
    return state;
  }

  const { limit, search } = params;
  const queryFingerprint = getQueryFingerprint(limit, search);
  const fetchedPages = state[queryFingerprint] ? state[queryFingerprint].pages : {};
  switch (type) {
    case PAGE_REQUEST:
      return {
        ...state,
        [queryFingerprint]: {
          count: 0,
          pages: {
            ...fetchedPages,
            [action.params.page]: {
              ids: [],
              fetching: true,
            },
          },
        },
      };
    case PAGE_SUCCESS:
      return {
        ...state,
        [queryFingerprint]: {
          count: data.count,
          pages: {
            ...fetchedPages,
            [action.params.page]: {
              ids: action.data.results.map(item => item.id),
              fetching: false,
              lastFetched: Date.now(),
            },
          },
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
        ...newItems,
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

/**
 * requestPage
 *
 * @param search {string} search query parameters
 */
export const requestPage = (endpoint, queryParams, key) => (
  (dispatch, getState) => {
    const store = getState();
    const params = getParams(queryParams);
    const { lastFetched } = getCurrentPages(store.pagination[key], queryParams)[params.page] || {};

    // perform the async call if the data is older than the allowed limit
    const isDataStale = Date.now() - lastFetched > settings.TIME_TO_STALE;

    if (isDataStale || !lastFetched) {
      return dispatch(fetchPage(endpoint, params));
    }
    return dispatch(abortRequest(endpoint, params));
  }
);

/**
 * createPaginator
 * --------------------------------------------------------- *
 */

/**
 * createPaginator is used to create a pagination for any module / component
 * with a server-side pagination
 *
 * @param endpoint {string} name of paginated module
 * @returns {object} an object composed with current page options,
 * reducers (requestPage action, reducer, items), see above in REDUCERS
 */
const createPaginator = endpoint => {
  const onlyForEndpoint = reducer => (state = {}, action = {}) =>
    (action.endpoint === endpoint ? reducer(state, action) : state);

  const reducer = onlyForEndpoint(combineReducers({
    currentPage: currentPageReducer,
    queries: queriesReducer,
  }));

  return {
    requestPage,
    reducer,
    itemsReducer: onlyForEndpoint(itemsReducer),
  };
};

export default createPaginator;
