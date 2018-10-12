export const USERS_LOAD_REQUEST = 'users/USERS_LOAD_REQUEST';
export const USERS_LOAD_SUCCESS = 'users/USERS_LOAD_SUCCESS';
export const USERS_LOAD_FAILURE = 'users/USERS_LOAD_FAILURE';

export const USER_EDIT_REQUEST = 'users/USER_PUT_REQUEST';
export const USER_EDIT_SUCCESS = 'users/USER_PUT_SUCCESS';
export const USER_EDIT_FAILURE = 'users/USER_PUT_FAILURE';

export const USER_DELETE_REQUEST = 'users/USER_DELETE_REQUEST';
export const USER_DELETE_SUCCESS = 'users/USER_DELETE_SUCCESS';
export const USER_DELETE_FAILURE = 'users/USER_DELETE_FAILURE';

export const initialState = {
  list: [],
  loading: false,
};
