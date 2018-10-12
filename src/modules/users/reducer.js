import {
  initialState,
  USERS_LOAD_REQUEST, USERS_LOAD_SUCCESS, USERS_LOAD_FAILURE, USERS_REMOVE_ITEM,
  USER_LOAD_SUCCESS,
  USER_EDIT_SUCCESS,
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
      const { id, data, updatedData } = action;
      const prevUser = state[id] || {};
      const newUser = updatedData
        ? ({
          ...prevUser,
          ...updatedData,
        })
        : (data || prevUser);

      return {
        ...state,
        [id]: newUser,
      };
    }

    case USERS_REMOVE_ITEM: {
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
