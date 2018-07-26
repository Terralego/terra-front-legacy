import {
  SUBMIT_SUCCESS,
} from './userrequestComment';

import userrequestCommentList, {
  getCommentsByUserrequest,
} from './userrequestCommentList';

describe('userrequestCommentList selector', () => {
  it('should return an array of selected ids objects', () => {
    const state = {
      userrequestCommentList: {
        items: {
          15: {},
          20: { 6: 'a' },
        },
      },
    };

    expect(getCommentsByUserrequest(state, 20)).toEqual(['a']);
  });

  it('should return an array ordered by date', () => {
    const state = {
      userrequestCommentList: {
        items: {
          15: {},
          20: {
            6: { content: 'a', date: '2018-02-18T16:48:09.299906+02:00' },
            7: { content: 'b', date: '2016-05-18T16:48:09.299906+02:00' },
            8: { content: 'c', date: '2018-05-18T16:48:09.299906+02:00' },
          },
        },
      },
    };

    expect(getCommentsByUserrequest(state, 20)).toEqual([
      { content: 'c', date: '2018-05-18T16:48:09.299906+02:00' },
      { content: 'a', date: '2018-02-18T16:48:09.299906+02:00' },
      { content: 'b', date: '2016-05-18T16:48:09.299906+02:00' },
    ]);
  });
});

describe('SUBMIT_SUCCESS action', () => {
  it('should add new comment when receive data', () => {
    const state = {
      items: {
        15: { 1: { content: 'ok', date: '01/02/18' } },
        20: { 6: { content: 'a', date: '01/02/18' }, 7: { content: 'b', date: '01/02/18' } },
      },
    };

    const action = {
      type: SUBMIT_SUCCESS,
      data: {
        id: 5,
        created_at: '2018-05-18T16:48:09.299906+02:00',
        updated_at: '2018-05-18T16:48:09.299949+02:00',
        is_internal: true,
        properties: {
          comment: 'blabla',
        },
        owner: {
          groups: ['user'],
          properties: {
            lastname: 'Janin',
            firstname: 'Alexandra',
          },
        },
        userrequest: 21,
        feature: null,
      },
    };

    const expectedState = {
      items: {
        15: { 1: { content: 'ok', date: '01/02/18' } },
        20: { 6: { content: 'a', date: '01/02/18' }, 7: { content: 'b', date: '01/02/18' } },
        21: { 5: {
          content: 'blabla',
          date: '2018-05-18T16:48:09.299906+02:00',
          author: 'Alexandra Janin',
          is_internal: true,
        } },
      },
    };
    expect(userrequestCommentList(state, action)).toEqual(expectedState);
  });
});
