import * as userrequest from 'modules/userrequest';
import reducer, * as userrequestList from './userrequestList';

describe('userrequestList reducer', () => {
  it('should return the initial state', () => {
    const ACTION = {};
    const result = {};

    expect(reducer(undefined, ACTION)).toEqual(result);
  });

  it('with DETAIL_REQUEST action', () => {
    const ACTION = {
      type: userrequestList.DETAIL_REQUEST,
    };
    const result = {};

    expect(reducer(undefined, ACTION)).toEqual(result);
  });

  it('with DETAIL_SUCCESS action', () => {
    const ACTION = {
      type: userrequestList.DETAIL_SUCCESS,
      data: { id: 12, content: 'content' },
    };
    const result = { 12: { id: 12, content: 'content' } };

    expect(reducer(undefined, ACTION)).toEqual(result);
  });

  it('with SUBMIT_SUCCESS action', () => {
    const ACTION = {
      type: userrequest.SUBMIT_SUCCESS,
      data: { id: 12, content: 'content' },
    };
    const result = { 12: { id: 12, content: 'content' } };

    expect(reducer(undefined, ACTION)).toEqual(result);
  });

  it('with SAVE_DRAFT_SUCCESS action', () => {
    const ACTION = {
      type: userrequest.SAVE_DRAFT_SUCCESS,
      data: { id: 12, content: 'content' },
    };
    const result = { 12: { id: 12, content: 'content' } };

    expect(reducer(undefined, ACTION)).toEqual(result);
  });

  it('with STATE_CHANGE_SUCCESS action', () => {
    const ACTION = {
      type: userrequestList.STATE_CHANGE_SUCCESS,
      data: { id: 12, content: 'content' },
    };
    const result = { 12: { id: 12, content: 'content' } };

    expect(reducer(undefined, ACTION)).toEqual(result);
  });

  it('with STATE_CHANGE_FAILURE action', () => {
    const ACTION = {
      type: userrequestList.STATE_CHANGE_FAILURE,
      data: { id: 12, content: 'content' },
    };
    const result = { 12: { id: 12, content: 'content' } };

    expect(reducer(undefined, ACTION)).toEqual(result);
  });

  it('with APPROBATIONS_CHANGE_SUCCESS action', () => {
    const ACTION = {
      type: userrequestList.APPROBATIONS_CHANGE_SUCCESS,
      data: { id: 12, content: 'content' },
    };
    const result = { 12: { id: 12, content: 'content' } };

    expect(reducer(undefined, ACTION)).toEqual(result);
  });

  it('with STATE_CHANGE_REQUEST action', () => {
    const ACTION = {
      type: userrequestList.STATE_CHANGE_REQUEST,
      endpoint: '/userrequest/12/',
    };
    const result = { 12: { isLoading: true } };

    expect(reducer(undefined, ACTION)).toEqual(result);
  });
});
