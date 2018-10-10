import { actions } from 'react-redux-form';
import { createSelector } from 'reselect';
import { disableTimerRefreshToken, enableTimerRefreshToken } from 'modules/authenticationTimer';
import apiService from 'services/apiService';
import tokenService from 'services/tokenService';
import { PROFILE_SUCCESS } from 'modules/profile';
import { resetPaginationCache } from 'modules/pagination';

export const REQUEST_TOKEN = 'authentication/REQUEST_TOKEN';
export const REFRESH_TOKEN = 'authentication/REFRESH_TOKEN';
export const RECEIVE_TOKEN = 'authentication/RECEIVE_TOKEN';
export const RESET_TOKEN = 'authentication/RESET_TOKEN';
export const SET_AUTHENTICATION = 'authentication/SET_AUTHENTICATION';
export const REQUEST_LOG_OUT = 'authentication/REQUEST_LOG_OUT';
export const AUTHENTICATION_FAILURE = 'authentication/AUTHENTICATION_FAILURE';

/**
 * Parse JWT
 * Decode token data
 * @param {string} token
 */
export function parseJwt (token) {
  const [header, payload, signature] = token.split('.'); // eslint-disable-line no-unused-vars
  const base64 = payload.replace('-', '+').replace('_', '/');
  try {
    return JSON.parse(atob(base64));
  } catch (e) {
    return {};
  }
}

const initialState = {
  isFetching: false,
  isAuthenticated: !!localStorage.getItem('token'),
  receivedAt: null,
  error: null,
  payload: {},
};

/**
 * REDUCER
 * --------------------------------------------------------- *
 */
const authentication = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST_TOKEN:
      return {
        ...state,
        isFetching: true,
      };
    case REQUEST_LOG_OUT:
      return initialState;
    case RECEIVE_TOKEN:
      return {
        ...state,
        isFetching: false,
        receivedAt: action.receivedAt,
      };
    case RESET_TOKEN:
    case SET_AUTHENTICATION:
      return {
        ...state,
        isAuthenticated: action.isAuthenticated,
        payload: {
          ...state.payload,
          ...action.payload,
        },
      };
    case AUTHENTICATION_FAILURE:
      return {
        ...state,
        error: action.error,
      };
    case PROFILE_SUCCESS:
      return {
        ...state,
        payload: {
          ...state.payload,
          user: {
            ...state.payload.user,
            properties: {
              ...state.payload.user.properties,
              ...action.data.properties,
            },
          },
        },
      };
    default:
      return state;
  }
};

export default authentication;

/**
 * SELECTORS
 * --------------------------------------------------------- *
 */

/**
 * getUserGroups selector
 * @param {object} state
 * @returns {string} current user group
 */
export const getUserGroups = createSelector(
  state => state.authentication.payload && state.authentication.payload.user,
  user => user && user.groups,
);

/**
 * getUserPermissions selector
 * @param {object} state
 * @returns {string} current user group
 */
export const getUserPermissions = createSelector(
  state => state.authentication.payload && state.authentication.payload.user,
  user => user && user.permissions,
);

/**
 * ACTIONS
 * --------------------------------------------------------- *
 */

export function requestToken () {
  return {
    type: REQUEST_TOKEN,
  };
}

export function requestLogOut () {
  return {
    type: REQUEST_LOG_OUT,
  };
}

/**
 * Action handle when fetch token failed
 * @param  {string} errorMessage
 */
export function setErrorMessage (error) {
  return {
    type: AUTHENTICATION_FAILURE,
    error,
  };
}

/**
 * Set authorization status
 */
export function setAuthentication () {
  return {
    type: SET_AUTHENTICATION,
    isAuthenticated: tokenService.isAuthenticated(),
    payload: tokenService.isAuthenticated() && parseJwt(tokenService.getToken()),
  };
}

export function resetToken () {
  tokenService.removeToken();
  return {
    type: RESET_TOKEN,
    isAuthenticated: tokenService.isAuthenticated(),
  };
}

/**
 * Receive token
 * @param {object} payload
 */
export const receiveToken = payload => ({
  type: RECEIVE_TOKEN,
  payload,
  isAuthenticated: true,
  receivedAt: Date.now(),
});

export const logout = () => dispatch => {
  dispatch(requestLogOut());
  dispatch(disableTimerRefreshToken());
  dispatch(actions.reset('login'));
  dispatch(actions.reset('userrequest'));
  dispatch(resetPaginationCache('/userrequest/'));
  dispatch(resetToken());
};

/**
 * Make a refresh request to the API.
 *
 * Allow the user to not re-login if the current token
 * is still in the period of 'refresh token allowed'.
 *
 */
export const refreshToken = () => dispatch => {
  const token = tokenService.getToken();

  dispatch(requestToken());
  dispatch(setAuthentication());

  return apiService.getFreshToken(token)
    .then(response => {
      dispatch(receiveToken());

      if (response && response.token) {
        tokenService.setToken(response.token);
        dispatch(setAuthentication());
      }
    })
    .catch(error => {
      dispatch(setErrorMessage(error));
      dispatch(logout());
    });
};

/**
 * Handle when user log in
 * @param {string} email
 * @param {string} password
 */
export const loginUser = ({ email, password }) => dispatch => {
  dispatch(requestToken());
  dispatch(actions.setPending('login', true));
  // dispatch(setAuthentication());

  return apiService
    .login(email, password)
    .then(response => {
      dispatch(receiveToken());
      dispatch(actions.setPending('login', false));
      dispatch(actions.setSubmitted('login', true));
      dispatch(actions.reset('login'));
      if (response && response.token) {
        tokenService.setToken(response.token);
        dispatch(setAuthentication());
        dispatch(enableTimerRefreshToken());
      }
    })
    .catch(error => {
      dispatch(receiveToken());
      dispatch(setErrorMessage(error));
      dispatch(actions.setPending('login', false));
      dispatch(actions.setSubmitFailed('login'));
    });
};
