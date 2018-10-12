import {
  initialState,
  USERS_LOAD_REQUEST, USERS_LOAD_SUCCESS, USERS_LOAD_FAILURE,
  USER_LOAD_REQUEST, USER_LOAD_SUCCESS, USER_LOAD_FAILURE,
  USER_EDIT_SUCCESS,
  USER_DELETE_REQUEST,
} from './constants';

const usersReducer = (state = initialState, action) => {
  switch (action.type) {
    case USERS_LOAD_REQUEST: {
      const { error, ...stateWithoutError } = state;
      return {
        ...stateWithoutError,
        loading: true,
      };
    }
    case USERS_LOAD_SUCCESS: {
      const { data: { count, results } } = action;
      const list = [...state.list];
      list.length = count;
      results.forEach(({ id }, k) => list.splice(k, 1, id));
      return {
        ...state,
        list,
        loading: false,
        ...results.reduce((users, user) => ({
          ...users,
          [user.id]: user,
        }), {}),
      };
    }
    case USERS_LOAD_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error,
      };

    case USER_LOAD_SUCCESS: {
      const { data: user } = action;
      return {
        ...state,
        [user.id]: user,
      };
    }

    case USER_EDIT_SUCCESS: {
      const { user, user: { id } } = action;
      const list = [...state.list];
      const prevIndex = list.findIndex(prevId => id === prevId);
      if (prevIndex > -1) {
        list.splice(prevIndex, 1, user);
      } else {
        list.splice(0, 0, user);
      }
      return {
        ...state,
        list,
      };
    }

    case USER_DELETE_REQUEST: {
      const { id } = action;
      const list = [...state.list];
      const prevIndex = list.findIndex(prevId => prevId === id);
      if (prevIndex > -1) {
        list.splice(prevIndex, 1);
        return {
          ...state,
          list,
        };
      }
      return {
        ...state,
      };
    }

    default:
      return state;
  }
};

export default usersReducer;
