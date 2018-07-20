import { CALL_API } from 'middlewares/api';

import reducer, * as account from './account';
import mocks from './__mocks__/account.json';

describe('account reducer', () => {
  it('should return the initial state', () => {
    const ACTION = {};
    const result = account.initialState;

    expect(reducer(undefined, ACTION)).toEqual(result);
  });

  it('with SIGNUP_REQUEST action', () => {
    const ACTION = {
      type: account.SIGNUP_REQUEST,
    };
    const result = account.initialState;

    expect(reducer(undefined, ACTION)).toEqual(result);
  });

  it('with SIGNUP_SUCCESS action', () => {
    const ACTION = {
      type: account.SIGNUP_SUCCESS,
    };
    const result = mocks.SIGNUP_SUCCESS;

    expect(reducer(undefined, ACTION)).toEqual(result);
  });

  it('with SIGNUP_FAILURE action', () => {
    const ACTION = {
      type: account.SIGNUP_FAILURE,
      error: {
        message: 'error message',
      },
    };
    const result = mocks.SIGNUP_FAILURE;

    expect(reducer(undefined, ACTION)).toEqual(result);
  });

  it('with CHANGE_PASSWORD_REQUEST action', () => {
    const ACTION = {
      type: account.CHANGE_PASSWORD_REQUEST,
    };
    const result = account.initialState;

    expect(reducer(undefined, ACTION)).toEqual(result);
  });

  it('with CHANGE_PASSWORD_SUCCESS action', () => {
    const ACTION = {
      type: account.CHANGE_PASSWORD_SUCCESS,
    };
    const result = account.initialState;

    expect(reducer(undefined, ACTION)).toEqual(result);
  });

  it('with CHANGE_PASSWORD_FAILURE action', () => {
    const ACTION = {
      type: account.CHANGE_PASSWORD_FAILURE,
    };
    const result = account.initialState;

    expect(reducer(undefined, ACTION)).toEqual(result);
  });

  it('with CHANGE_PASSWORD_FAILURE action', () => {
    const ACTION = {
      type: account.CHANGE_PASSWORD_FAILURE,
    };
    const result = account.initialState;

    expect(reducer(undefined, ACTION)).toEqual(result);
  });

  it('with NEW_PASSWORD_REQUEST action', () => {
    const ACTION = {
      type: account.NEW_PASSWORD_REQUEST,
    };
    const result = account.initialState;

    expect(reducer(undefined, ACTION)).toEqual(result);
  });

  it('with NEW_PASSWORD_SUCCESS action', () => {
    const ACTION = {
      type: account.NEW_PASSWORD_SUCCESS,
    };
    const result = mocks.NEW_PASSWORD_SUCCESS;

    expect(reducer(undefined, ACTION)).toEqual(result);
  });

  it('with NEW_PASSWORD_FAILURE action', () => {
    const ACTION = {
      type: account.NEW_PASSWORD_FAILURE,
    };
    const result = account.initialState;

    expect(reducer(undefined, ACTION)).toEqual(result);
  });

  describe('signUp API action creator', () => {
    it('with no argument', () => {
      const signUpResult = account.signUp()[CALL_API];
      const result = mocks.signUp.noargs;

      expect(signUpResult).toEqual(result);
    });

    it('with arguments', () => {
      const signUpResult = account.signUp(
        { new_password1: 'new_password1', new_password2: 'new_password2' },
        'faked_uidb64',
        'faked_token',
      )[CALL_API];
      const result = mocks.signUp.default;

      expect(signUpResult).toEqual(result);
    });
  });

  describe('newPassword API action creator', () => {
    it('with no argument', () => {
      const newPasswordResult = account.newPassword()[CALL_API];
      const result = mocks.newPassword.noargs;

      expect(newPasswordResult).toEqual(result);
    });

    it('with arguments', () => {
      const newPasswordResult = account.newPassword(
        { new_password1: 'new_password1', new_password2: 'new_password2' },
        'faked_uidb64',
        'faked_token',
      )[CALL_API];
      const result = mocks.newPassword.default;

      expect(newPasswordResult).toEqual(result);
    });
  });

  describe('changePassword API action creator', () => {
    it('with no arguments', () => {
      const changePasswordResult = account.changePassword()[CALL_API];
      const result = mocks.changePassword.noargs;

      expect(changePasswordResult).toEqual(result);
    });

    it('with arguments', () => {
      const changePasswordResult = account.changePassword({ new_password1: 'new_password1', new_password2: 'new_password2' })[CALL_API];
      const result = mocks.changePassword.default;

      expect(changePasswordResult).toEqual(result);
    });
  });
});
