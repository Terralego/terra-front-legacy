import { CALL_API } from 'middlewares/api';
import apiService, { defaultHeaders } from 'services/apiService';

import {
  USERS_LOAD_REQUEST, USERS_LOAD_SUCCESS, USERS_LOAD_FAILURE,
  USER_LOAD_REQUEST, USER_LOAD_SUCCESS, USER_LOAD_FAILURE,
  USER_EDIT_REQUEST, USER_EDIT_SUCCESS, USER_EDIT_FAILURE,
  USER_DELETE_REQUEST, USER_DELETE_SUCCESS, USER_DELETE_FAILURE,
} from './constants';

export const loadUsers = ({ groupsIn }) => {
  const params = {};
  if (groupsIn) {
    params.groups_in = groupsIn;
  }

  return ({
    [CALL_API]: {
      endpoint: '/user/',
      types: [USERS_LOAD_REQUEST, USERS_LOAD_SUCCESS, USERS_LOAD_FAILURE],
      config: {
        headers: defaultHeaders,
        method: 'GET',
        params,
      },
    },
  });
};

export const loadUser = id => ({
  [CALL_API]: {
    endpoint: `/user/${id}`,
    types: [USER_LOAD_REQUEST, USER_LOAD_SUCCESS, USER_LOAD_FAILURE],
    config: {
      headers: defaultHeaders,
      method: 'GET',
    },
  },
});

export const editUser = user => async dispatch => {
  dispatch({ type: USER_EDIT_REQUEST });

  try {
    const updatedUser = await { // Put a real request here
      ...user,
    };
    dispatch({
      type: USER_EDIT_SUCCESS,
      id: updatedUser.id,
      data: updatedUser,
    });
  } catch (error) {
    dispatch({
      type: USER_EDIT_FAILURE,
      error,
    });
  }
};

export const deleteUser = id => async dispatch => {
  dispatch({
    type: USER_DELETE_REQUEST,
    id,
  });

  try {
    await new Promise(resolve => setTimeout(resolve, 2000)); // Put a real request here;
    dispatch({
      type: USER_DELETE_SUCCESS,
      id,
    });
  } catch (error) {
    dispatch({
      type: USER_DELETE_FAILURE,
      id,
      error,
    });
  }
};

export const setUserGroups = (id, groups) => async dispatch => {
  dispatch({ type: USER_EDIT_REQUEST, id });

  try {
    await apiService.request(`/user/${id}/groups/`, {
      headers: defaultHeaders,
      method: 'POST',
      body: JSON.stringify({
        groups,
      }),
    });

    dispatch({
      type: USER_EDIT_SUCCESS,
      id,
      updatedData: {
        groups,
      },
    });
  } catch (error) {
    dispatch({ type: USER_EDIT_FAILURE, error });
  }
};

export default null;
