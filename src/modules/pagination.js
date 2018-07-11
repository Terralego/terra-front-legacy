import { combineReducers } from 'redux';
import { createSelector } from 'reselect';
import queryString from 'query-string';
import settings from 'front-settings';
import { CALL_API } from 'middlewares/api';
import pick from 'lodash.pick';

export const ABORT_REQUEST = 'pagination/ABORT_REQUEST';
export const REQUEST_PAGE = 'pagination/REQUEST_PAGE';
export const RECEIVE_PAGE = 'pagination/RECEIVE_PAGE';

// Pages request actions
export const PAGE_REQUEST = 'pagination/PAGE_REQUEST';
export const PAGE_ABORT_REQUEST = 'pagination/PAGE_ABORT_REQUEST';
export const PAGE_SUCCESS = 'pagination/PAGE_SUCCESS';
export const PAGE_FAILURE = 'pagination/PAGE_FAILURE';


/**
 * REDUCERS
 * --------------------------------------------------------- *
 */

export const paramsReducer = (state = {}, action = {}) => {
  const { type, data, params } = action;
  const key = queryString.stringify(params);

  switch (type) {
    case PAGE_REQUEST:
      return {
        ...state,
        [key]: undefined,
      };
    case PAGE_SUCCESS:
      return {
        ...state,
        [key]: data.count,
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

const currentPageReducer = (state = 1, action = {}) =>
  (action.type === PAGE_REQUEST ? action.params.page : state);


const itemsReducer = (state = {}, action = {}) => {
  const newItems = {};
  switch (action.type) {
    case PAGE_SUCCESS:
      action.data.results.forEach(item => {
        newItems[item.id] = item;
      });

      return {
        ...state,
        items: newItems,
      };
    default:
      return state;
  }
};

/**
 * ACITIONS
 * --------------------------------------------------------- *
 */

/**
 * abortRequest call when data is fresh, no need to perform new request
 */
export const abortRequest = () => ({
  type: ABORT_REQUEST,
});

/**
 * fetchPage action : fetch requested page
 * @param {string} id
 */
export const fetchPage = params => ({
  [CALL_API]: {
    types: [PAGE_REQUEST, PAGE_SUCCESS, PAGE_FAILURE],
    config: { method: 'GET' },
    endpoint: '/userrequest/',
    params,
  },
});

const getPageFromCache = (params, pageLoaded) => (
  (dispatch, getState) => {
    const store = getState();
    // Get the last fetched date
    const timeSinceLastFetch = store.userrequestList.lastFetched;
    // // perform the async call if the data is older than the allowed limit
    const isDataStale = Date.now() - timeSinceLastFetch > settings.TIME_TO_STALE;

    if (isDataStale || !pageLoaded) {
      return dispatch(fetchPage(params));
    }
    return dispatch(abortRequest());
  }
);

/**
 * requestPage
 *
 * @param search {string} search query parameters
 */
const requestPage = search => (
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
    return dispatch(getPageFromCache(params, pageLoaded));
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
  (currentPage, items) => (typeof currentPage === 'undefined' ? [] : Object.values(pick(items || [], currentPage.ids))),
);

// TODO: optimize and use createSelector
/**
 * getPaginationParams returns items contains in requested page
 *
 * @param pagination {object} pagination object
 * @param params {string} query parameters
 * @returns {object} query params and items per page count
 */
export const getPaginationParams = (pagination, params) => {
  let paginationParams = params;
  let count = 0;

  if (params === '') {
    paginationParams = `?limit=${settings.PAGE_SIZE}&page=${1}`;
  }

  if (pagination && pagination.params) {
    // We remove first char
    count = pagination.params[paginationParams.slice(1)];
  }

  const parseParams = queryString.parse(paginationParams);

  return {
    params: {
      limit: parseInt(parseParams.limit, 10) || settings.PAGE_SIZE,
      page: parseInt(parseParams.page, 10) || 1,
    },
    count,
  };
};

export const isCurrentPageFetching = pagination =>
  (pagination.pages[pagination.currentPage] || { fetching: true }).fetching;
