import { CALL_API } from 'middlewares/api';

import reducer, * as userrequestComment from './userrequestComment';
import mocks from './__mocks__/userrequestComment.json';

describe('userrequestComment reducer', () => {
  it('should return the initial state', () => {
    const ACTION = {};
    const result = userrequestComment.initialState;

    expect(reducer(undefined, ACTION)).toEqual(result);
  });

  it('with SUBMIT_REQUEST action', () => {
    const ACTION = {
      type: userrequestComment.SUBMIT_REQUEST,
    };
    const result = userrequestComment.initialState;

    expect(reducer(undefined, ACTION)).toEqual(result);
  });

  it('with SUBMIT_SUCCESS action', () => {
    const ACTION = {
      type: userrequestComment.SUBMIT_SUCCESS,
    };
    const result = mocks.SUBMIT_SUCCESS;

    expect(reducer(undefined, ACTION)).toEqual(result);
  });

  it('with SUBMIT_FAILURE action', () => {
    const ACTION = {
      type: userrequestComment.SUBMIT_FAILURE,
      error: {
        message: 'error message',
      },
    };
    const result = mocks.SUBMIT_FAILURE;

    expect(reducer(undefined, ACTION)).toEqual(result);
  });

  it('with GEOJSON_COMMENT_CLEAR action', () => {
    const ACTION = {
      type: userrequestComment.GEOJSON_COMMENT_CLEAR,
    };
    const { state, result } = mocks.clearGeojson;

    expect(reducer(state, ACTION)).toEqual(result);
  });

  it('with COMMENT_ATTACHMENT_ADD action', () => {
    const ACTION = {
      type: userrequestComment.COMMENT_ATTACHMENT_ADD,
      attachment: 'a',
    };
    const result = mocks.COMMENT_ATTACHMENT_ADD;

    expect(reducer(undefined, ACTION)).toEqual(result);
  });

  it('with COMMENT_ATTACHMENT_REMOVE action', () => {
    const ACTION = {
      type: userrequestComment.COMMENT_ATTACHMENT_REMOVE,
      attachment: 'a',
    };
    const { state, result } = mocks.attachmentRemove;

    expect(reducer(state, ACTION)).toEqual(result);
  });

  describe('submitComment API action creator', () => {
    it('with no argument', () => {
      const submitCommentResult = userrequestComment.submitComment()[CALL_API];
      const result = mocks.submitComment.noargs;

      expect(submitCommentResult.types).toEqual(result.types);
    });

    it('with arguments', () => {
      const submitCommentResult = userrequestComment.submitComment(
        2,
        {
          geojson: {
            type: 'FeatureCollection',
            features: [],
          },
          attachment: 'a',
          properties: {
            comment: 'b',
          },
          is_internal: null,
          error: null,
        },
      )[CALL_API];
      const result = mocks.submitComment.default;

      expect(submitCommentResult.types).toEqual(result.types);
    });
  });
});
