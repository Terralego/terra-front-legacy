import configureMockStore from 'redux-mock-store';
import createPaginator, {
  getCurrentPageResults,
  getPaginationParams,
  getCurrentPages,
  isCurrentPageFetching,
  abortRequest,
  fetchPage,
  requestPage,
  PAGE_ABORT_REQUEST,
  PAGE_REQUEST, PAGE_SUCCESS, PAGE_FAILURE,
} from './pagination';

import thunk from 'redux-thunk';
import api from 'middlewares/api';

import FetchMock from 'fetch-mock';
// import api from 'middlewares/api';

const middlewares = [api, thunk];
const mockStore = configureMockStore(middlewares);

const items = {
  todo1: {
    id: 'todo1',
    text: 'some todo task 1',
  },
  todo2: {
    id: 'todo2',
    text: 'some todo task 2',
  },
  todo3: {
    id: 'todo3',
    text: 'some todo task 3',
  },
};

const pages = {
  1: {
    ids: ['todo1', 'todo2'],
    fetching: false,
  },
  2: {
    ids: ['todo3'],
    fetching: false,
  },
  3: {
    ids: [],
    fetching: true,
  },
};

describe('pagination SELECTORS', () => {
  describe('getCurrentPages', () => {
    it('should returns an empty object if pagination is not defined', () => {
      expect(getCurrentPages()).toEqual({});
    });
  });

  describe('getCurrentPageResults', () => {
    it('should return an array of page 1 items', () => {
      const pagination = {
        currentPage: 1,
        queries: {
          'limit=10&page=1': {
            pages,
          },
        },
      };
      expect(getCurrentPageResults(pagination, '?limit=10&page=1', items))
        .toEqual([
          {
            id: 'todo1',
            text: 'some todo task 1',
          },
          {
            id: 'todo2',
            text: 'some todo task 2',
          },
        ]);
    });

    it('should return an array even if items are not defined', () => {
      const pagination = {
        currentPage: 1,
        queries: {},
      };
      expect(getCurrentPageResults(pagination, '?limit=10&page=1', undefined))
        .toEqual([]);
    });

    it('should return an array even if currentPage is not defined', () => {
      const pagination = {
        queries: {},
      };
      expect(getCurrentPageResults(pagination, '?limit=10&page=1', items))
        .toEqual([]);
    });

    it('should return default query if no query parameters', () => {
      const pagination = {
        queries: {
          'limit=10&page=1': {
            pages,
          },
        },
      };
      expect(getCurrentPageResults(pagination, '', items))
        .toEqual([
          {
            id: 'todo1',
            text: 'some todo task 1',
          },
          {
            id: 'todo2',
            text: 'some todo task 2',
          },
        ]);
    });

    it('should return an array of page 2 items', () => {
      const pagination = {
        currentPage: 2,
        queries: {
          'limit=10&page=2': {
            pages,
          },
        },
      };
      expect(getCurrentPageResults(pagination, '?limit=10&page=2', items))
        .toEqual([
          {
            id: 'todo3',
            text: 'some todo task 3',
          },
        ]);
    });
  });

  describe('getPaginationParams', () => {
    it('should return params of page 1', () => {
      const pagination = {
        currentPage: 1,
        queries: {
          'limit=100&page=1': {
            count: 4,
            pages,
          },
        },
      };
      const queryParams = '?limit=100&page=1';
      expect(getPaginationParams(pagination, queryParams))
        .toEqual({
          params: {
            limit: 100,
            page: 1,
            search: '',
          },
          count: 4,
        });
    });

    it('should allow unknow query params', () => {
      const pagination = {
        currentPage: 1,
        queries: {
          'limit=100&page=1': {
            count: 4,
            pages,
          },
        },
      };
      const queryParams = '?limit=100&page=1&truc=40';
      expect(getPaginationParams(pagination, queryParams))
        .toEqual({
          params: {
            limit: 100,
            page: 1,
            search: '',
          },
          count: 4,
        });
    });

    it('should return limit, page and search params of query string', () => {
      const queryParams = '?limit=100&page=1&search=test';
      expect(getPaginationParams(undefined, queryParams))
        .toEqual({
          params: {
            limit: 100,
            page: 1,
            search: 'test',
          },
          count: 0,
        });
    });

    it('should return default limit, page and search query string if no parameters', () => {
      expect(getPaginationParams())
        .toEqual({
          params: {
            limit: 10,
            page: 1,
            search: '',
          },
          count: 0,
        });
    });

    it('should return default limit and search if only page is defined', () => {
      expect(getPaginationParams(undefined, '?page=3'))
        .toEqual({
          params: {
            limit: 10,
            page: 3,
            search: '',
          },
          count: 0,
        });
    });
  });

  describe('isCurrentPageFetching', () => {
    it('should should return false if page is not fetching', () => {
      const pagination = {
        currentPage: 2,
        queries: {
          'limit=10&page=2': {
            pages,
          },
        },
      };

      expect(isCurrentPageFetching(pagination, 'limit=10&page=2')).toEqual(false);
    });

    it('should should return true if page is fetching', () => {
      const pagination = {
        currentPage: 3,
        queries: {
          'limit=10&page=3': {
            pages,
          },
        },
      };

      expect(isCurrentPageFetching(pagination, 'limit=10&page=3')).toEqual(true);
    });
  });
});

describe('pagination ACTIONS', () => {
  describe('abortRequest', () => {
    it('should return a PAGE_ABORT_REQUEST action', () => {
      expect(abortRequest('test', {})).toEqual({
        type: PAGE_ABORT_REQUEST,
        endpoint: 'test',
        params: {},
      });
    });
  });

  describe('fetchPage', () => {
    it('should return a PAGE_REQUEST action, then PAGE_SUCCESS if success', () => {
      FetchMock.get('*', JSON.stringify('my response'));
      const store = mockStore({});
      return store.dispatch(fetchPage('a')).then(() => {
        const actions = store.getActions();
        expect(actions).toEqual([{
          endpoint: 'a',
          type: PAGE_REQUEST,
        }, {
          data: 'my response',
          endpoint: 'a',
          type: PAGE_SUCCESS,
        }]);
      });
    });

    it('should return a PAGE_REQUEST action, then PAGE_FAILURE if error', () => {
      FetchMock.get('*', 404, { overwriteRoutes: true });
      const store = mockStore({});
      return store.dispatch(fetchPage('a')).then(() => {
        const actions = store.getActions();
        expect(actions).toEqual([{
          endpoint: 'a',
          type: PAGE_REQUEST,
        }, {
          error: {
            message: 'Une erreur est survenue',
          },
          type: PAGE_FAILURE,
        }]);
      });
    });
  });

  describe('requestPage', () => {
    it('should return a PAGE_REQUEST action, then PAGE_ABORT_REQUEST if page already fetched', () => {
      const store = mockStore({
        pagination: {
          test: {
            currentPage: 1,
            queries: {
              'limit=10&page=1': {
                count: 50,
                pages: {
                  1: {
                    ids: [],
                    fetching: false,
                    lastFetched: new Date(),
                  },
                },
              },
            },
          },
        },
      });
      store.dispatch(requestPage('test', '?limit=10&page=1', 'test'));
      const state = store.getActions();
      expect(state).toEqual([{
        type: PAGE_ABORT_REQUEST,
        endpoint: 'test',
        params: {
          limit: 10,
          page: 1,
          search: '',
        },
      }]);
    });

    it('should return a PAGE_REQUEST action, then PAGE_SUCCESS if success if no data fetched', () => {
      FetchMock.get('*', JSON.stringify('ok'), { overwriteRoutes: true });
      const store = mockStore({
        pagination: {
          test: {
            queries: {},
          },
        },
      });
      return store.dispatch(requestPage('test', '', 'test')).then(() => {
        const actions = store.getActions();
        expect(actions).toEqual([{
          endpoint: 'test',
          type: PAGE_REQUEST,
          params: {
            limit: 10,
            page: 1,
            search: '',
          },
        }, {
          endpoint: 'test',
          data: 'ok',
          type: PAGE_SUCCESS,
          params: {
            limit: 10,
            page: 1,
            search: '',
          },
        }]);
      });
    });
  });
});

describe('pagination REDUCERS', () => {
  it('should return initial state of itemsReducer when no state either action provide', () => {
    const testPaginator = createPaginator();
    const testReducer = testPaginator.itemsReducer();
    expect(testReducer).toEqual({
      currentPage: 1,
      queries: {},
    });
  });

  it('should return state of itemsReducer when state provide', () => {
    const testPaginator = createPaginator('test');
    const testReducer = testPaginator.itemsReducer('test');
    expect(testReducer).toEqual(('test'));
  });
});
