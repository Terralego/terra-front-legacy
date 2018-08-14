import { combineReducers } from 'redux';
import { createSelector } from 'reselect';
import queryString from 'query-string';
import settings from 'front-settings';
import { CALL_API } from 'middlewares/api';
import { defaultHeaders } from 'services/apiService';
import pick from 'lodash.pick';

// Pages request actions
export const PAGE_REQUEST = 'pagination/PAGE_REQUEST';
export const PAGE_ABORT_REQUEST = 'pagination/PAGE_ABORT_REQUEST';
export const PAGE_SUCCESS = 'pagination/PAGE_SUCCESS';
export const PAGE_FAILURE = 'pagination/PAGE_FAILURE';

export const RESET = 'pagination/RESET';

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
const getQueryFingerprint = ({ limit, page, search }) => {
  let query = `limit=${limit}&page=${page}`;
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
    limit: params.limit ? parseInt(params.limit, 10) : settings.PAGE_SIZE,
    page: params.page ? parseInt(params.page, 10) : 1,
    search: params.search || '',
    ordering: params.ordering || '-id',
  };
};

/**
 * SELECTORS
 * --------------------------------------------------------- *
 */

/**
 * getCurrentPage returns pagination data by queryFigerprint
 *
 * @param pagination {object} pagination object
 * @param queryParams {string}
 * @returns {object} object of requested queryParams
 */
export const getCurrentPage = (pagination = { queries: {} }, queryParams) => {
  const key = getQueryFingerprint(getParams(queryParams));
  return pagination.queries && pagination.queries[key] ? pagination.queries[key] : {};
};

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
    (pagination, queryParams) => queryParams,
    (pagination, queryParams, items) => items,
  ],
  (currentPage, queryParams, items = []) => {
    const { ordering } = queryString.parse(queryParams);

    if (currentPage.ids) {
      const values = Object.values(pick(items, currentPage.ids));
      if (!ordering || ordering.charAt(0) === '-') {
        values.reverse();
      }
      return values;
    }
    return [];
  },
);

/**
 * getPaginationParams returns items contains in requested page
 *
 * @param pagination {object} pagination object
 * @param params {string} query parameters
 * @returns {object} query params and items per page count
 */
export const getPaginationParams = (pagination = { queries: {} }, queryParams) => {
  const params = getParams(queryParams);
  const key = getQueryFingerprint(params);
  const count = pagination.queries && pagination.queries[key] ? pagination.queries[key].count : 0;

  return {
    params: {
      limit: +params.limit,
      page: +params.page,
      search: params.search,
      ordering: params.ordering,
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
  switch (type) {
    case PAGE_REQUEST:
      return {
        ...state,
        [getQueryFingerprint(params)]: {
          count: 0,
          fetching: true,
          ids: [],
        },
      };
    case PAGE_SUCCESS:
      return {
        ...state,
        [getQueryFingerprint(params)]: {
          count: data.count,
          ids: action.data.results.map(item => item.id),
          fetching: false,
          lastFetched: Date.now(),
        },
      };
    case RESET:
      return {};
    default:
      return state;
  }
};

const currentPageReducer = (state = 1, action = {}) => {
  switch (action.type) {
    case PAGE_REQUEST:
    case PAGE_ABORT_REQUEST:
      return action.params.page;
    case RESET:
      return 1;
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
    case RESET:
      return {};
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
    config: { headers: defaultHeaders },
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
    const { lastFetched } = getCurrentPage(store.pagination[key], queryParams);

    // perform the async call if the data is older than the allowed limit
    const isDataStale = Date.now() - lastFetched > settings.TIME_TO_STALE;

    const params = getParams(queryParams);
    if (isDataStale || !lastFetched) {
      return dispatch(fetchPage(endpoint, params));
    }
    return dispatch(abortRequest(endpoint, params));
  }
);

/**
 * resetPaginationCache reset pagination object of given endpoint
 *
 * @param endpoint {string} endpoint of pagination that we wan't to clear
 */
export const resetPaginationCache = endpoint => ({
  type: RESET,
  endpoint,
});

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
    resetPaginationCache,
    reducer,
    itemsReducer: onlyForEndpoint(itemsReducer),
  };
};

export default createPaginator;
