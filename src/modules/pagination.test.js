import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import FetchMock from 'fetch-mock';

import api from 'middlewares/api';
import createPaginator, {
  getCurrentPageResults,
  getPaginationParams,
  getCurrentPage,
  isCurrentPageFetching,
  abortRequest,
  fetchPage,
  requestPage,
  PAGE_ABORT_REQUEST,
  PAGE_REQUEST, PAGE_SUCCESS, PAGE_FAILURE,
  resetPaginationCache, RESET,
} from './pagination';

// import api from 'middlewares/api';

const middlewares = [api, thunk];
const mockStore = configureMockStore(middlewares);


describe('pagination SELECTORS', () => {
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

  describe('getCurrentPages', () => {
    it('should returns an empty object if pagination is not defined', () => {
      expect(getCurrentPage()).toEqual({});
    });
  });

  describe('getCurrentPageResults', () => {
    it('should return an array of page 1 items', () => {
      const pagination = {
        currentPage: 1,
        queries: {
          'limit=10&page=1': {
            ids: ['todo1', 'todo2'],
            fetching: false,
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
            ids: ['todo1', 'todo2'],
            fetching: false,
          },
          'limit=10&page=2': {
            ids: ['todo3'],
            fetching: false,
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
            ids: ['todo3'],
            fetching: false,
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
    it('should return false if page is not fetching', () => {
      const pagination = {
        currentPage: 2,
        queries: {
          'limit=10&page=2': {
            fetching: false,
          },
        },
      };

      expect(isCurrentPageFetching(pagination, 'limit=10&page=2')).toEqual(false);
    });

    it('should return true if page is fetching', () => {
      const pagination = {
        currentPage: 3,
        queries: {
          'limit=10&page=3': {
            fetching: true,
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
        expect(actions[0].type).toEqual(PAGE_REQUEST);
        expect(actions[1].type).toEqual(PAGE_SUCCESS);
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
                ids: [],
                fetching: false,
                lastFetched: Date.now(),
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
          ordering: '-id',
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
        expect(actions[0].type).toEqual(PAGE_REQUEST);
        expect(actions[1].type).toEqual(PAGE_SUCCESS);
      });
    });
  });

  describe('resetPaginationCache', () => {
    it('should return a PAGE_ABORT_REQUEST action', () => {
      expect(resetPaginationCache()).toEqual({
        type: RESET,
      });
    });
  });
});

describe('pagination REDUCERS', () => {
  it('itemsReducer should return {} when no state either action provide', () => {
    const testPaginaton = createPaginator('test');
    const testReducer = testPaginaton.itemsReducer();
    expect(testReducer).toEqual(({}));
  });

  describe('itemReducer', () => {
    const testPaginaton = createPaginator('test');

    it('should return all items by id on PAGE_SUCCESS action', () => {
      const testReducer = testPaginaton.itemsReducer(undefined, {
        type: PAGE_SUCCESS,
        data: {
          count: 3,
          results: [
            { id: 'a' },
            { id: 'b' },
          ],
        },
        endpoint: 'test',
        params: {
          limit: 2,
          page: 1,
          search: '',
        },
      });
      expect(testReducer).toEqual({
        a: { id: 'a' },
        b: { id: 'b' },
      });
    });

    it('should have the same state if on PAGE_ABORT_REQUEST action', () => {
      const testReducer = testPaginaton.itemsReducer('test', {
        type: PAGE_ABORT_REQUEST,
      });
      expect(testReducer).toEqual('test');
    });
  });

  describe('pagination reducer', () => {
    const testPaginaton = createPaginator('test').reducer;
    it('should reset pages objects by query on PAGE_REQUEST action', () => {
      const testReducer = testPaginaton(undefined, {
        type: PAGE_REQUEST,
        endpoint: 'test',
        params: {
          limit: 2,
          page: 1,
          search: '',
        },
      });
      expect(testReducer).toEqual({
        currentPage: 1,
        queries: {
          'limit=2&page=1': {
            count: 0,
            ids: [],
            fetching: true,
          },
        },
      });
    });

    it('should return pages objects by query on PAGE_SUCCESS action', () => {
      const testReducer = testPaginaton(undefined, {
        type: PAGE_SUCCESS,
        data: {
          count: 3,
          results: [
            { id: 'a' },
            { id: 'b' },
          ],
        },
        endpoint: 'test',
        params: {
          limit: 2,
          page: 1,
          search: '',
        },
      });

      const { ids } = testReducer.queries['limit=2&page=1'];
      expect(ids).toEqual(['a', 'b']);
    });

    it('should keep fetching pages on a new PAGE_SUCCESS action', () => {
      const state = {
        currentPage: 2,
        queries: {
          'limit=2&page=1': {
            count: 3,
            ids: ['a', 'b'],
            fetching: false,
            lastFetched: 1,
          },
        },
      };

      const action = {
        type: PAGE_SUCCESS,
        data: {
          count: 3,
          results: [
            { id: 'c' },
          ],
        },
        endpoint: 'test',
        params: {
          limit: 2,
          page: 2,
          search: '',
        },
      };
      const testReducer = testPaginaton(state, action);

      const page1 = testReducer.queries['limit=2&page=1'];
      const page2 = testReducer.queries['limit=2&page=2'];

      expect(page1.ids).toEqual(['a', 'b']);
      expect(page2.ids).toEqual(['c']);
    });
  });

  describe('resetPaginationCache', () => {
    const testPaginatonA = createPaginator('a').reducer;
    const testPaginatonB = createPaginator('b').reducer;
    const state = {
      currentPage: 2,
      queries: {
        'limit=2&page=1': {
          count: 3,
          ids: ['a', 'b'],
          fetching: false,
          lastFetched: 1,
        },
      },
    };

    const action = {
      type: RESET,
      endpoint: 'a',
    };
    const testReducerA = testPaginatonA(state, action);
    const testReducerB = testPaginatonB(state);

    it('should clear endpoint reducer', () => {
      expect(testReducerA).toEqual({
        currentPage: 1,
        queries: {},
      });
    });

    it('should not clear others endpoint reducer', () => {
      expect(testReducerB).toEqual(state);
    });
  });
});
