import { getCurrentPageResults, getPaginationParams } from './pagination';

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

describe('pagination selector', () => {
  it('getCurrentPageResults should return an array of page 1 items', () => {
    const pagination = {
      currentPage: 1,
      pages,
    };
    expect(getCurrentPageResults(items, pagination))
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

  it('getCurrentPageResults should return an array of page 2 items', () => {
    const pagination = {
      currentPage: 2,
      pages,
    };
    expect(getCurrentPageResults(items, pagination))
      .toEqual([
        {
          id: 'todo3',
          text: 'some todo task 3',
        },
      ]);
  });

  it('getPaginationParams should return an array of page 2 items', () => {
    const pagination = {
      currentPage: 2,
      pages,
    };
    expect(getPaginationParams(pagination, '?limit=100&page=1'))
      .toEqual({
        params: {
          limit: 100,
          page: 1,
        },
        count: 0,
      });
  });
});
