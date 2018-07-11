import { combineReducers } from 'redux';
import { createSelector } from 'reselect';
import queryString from 'query-string';
import settings from 'front-settings';
import { CALL_API } from 'middlewares/api';

export const REQUEST_PAGE = 'pagination/REQUEST_PAGE';
export const RECEIVE_PAGE = 'pagination/RECEIVE_PAGE';

// Pages request actions
export const PAGE_REQUEST = 'pagination/PAGE_REQUEST';
export const PAGE_ABORT_REQUEST = 'pagination/PAGE_ABORT_REQUEST';
export const PAGE_SUCCESS = 'pagination/PAGE_SUCCESS';
export const PAGE_FAILURE = 'pagination/PAGE_FAILURE';

export const countReducer = (state = {}, action = {}) => {
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
          ids: action.data.results.filter(item => item.id),
          fetching: false,
        },
      };
    default:
      return state;
  }
};

const currentPageReducer = (state = 1, action = {}) =>
  (action.type === PAGE_REQUEST ? action.params.page : state);

const createPaginator = (endpoint, resultKey = 'results') => {
  const requestPage = search => {
    let params = {
      limit: settings.PAGE_SIZE,
      page: 1,
    };

    if (search !== '') {
      params = queryString.parse(search);
    }

    return ({
      [CALL_API]: {
        types: [PAGE_REQUEST, PAGE_SUCCESS, PAGE_FAILURE],
        config: { method: 'GET' },
        endpoint: '/userrequest/',
        params,
      },
    });
  };

  const onlyForEndpoint = reducer => (state = {
    pages: {},
    currentPage: 1,
  }, action = {}) =>
    (action.endpoint === endpoint ? reducer(state, action) : state);

  const itemsReducer = (items = {}, action = {}) => {
    const newItems = {};
    switch (action.type) {
      case PAGE_SUCCESS:
        action.data[resultKey].forEach(item => {
          newItems[item.id] = item;
        });

        return {
          ...items,
          ...newItems,
        };
      default:
        return items;
    }
  };

  const reducer = onlyForEndpoint(combineReducers({
    pages: pagesReducer,
    currentPage: currentPageReducer,
    count: countReducer,
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

// TODO: optimize and use createSelector
export const getCurrentPageResults = (items, pagination) => {
  const currentPage = pagination.pages[pagination.currentPage];
  return typeof currentPage === 'undefined' ? [] : Object.values(currentPage.ids);
};

// TODO: optimize and use createSelector
export const getPaginationParams = (pagination, params) => {
  let paginationParams = params;
  let count = 0;

  if (params === '') {
    paginationParams = `?limit=${settings.PAGE_SIZE}&page=${1}`;
  }

  if (pagination && pagination.count) {
    // We remove first char
    count = pagination.count[paginationParams.slice(1)];
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
