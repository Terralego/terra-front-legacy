import { createSelector } from 'reselect';
import { disableTimerRefreshToken, enableTimerRefreshToken } from 'modules/authenticationTimer';
import apiService from 'services/apiService';
import tokenService from 'services/tokenService';

export const REQUEST_TOKEN = 'authentication/REQUEST_TOKEN';
export const REFRESH_TOKEN = 'authentication/REFRESH_TOKEN';
export const RECEIVE_TOKEN = 'authentication/RECEIVE_TOKEN';
export const RESET_TOKEN = 'authentication/RESET_TOKEN';
export const SET_AUTHENTICATION = 'authentication/SET_AUTHENTICATION';
export const REQUEST_LOG_OUT = 'authentication/REQUEST_LOG_OUT';
export const SET_ERROR_MESSAGE = 'authentication/SET_ERROR_MESSAGE';

/**
 * Parse JWT
 * Decode token data
 * @param  {string} token
 */
function parseJwt (token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace('-', '+').replace('_', '/');
  return JSON.parse(window.atob(base64));
}

const initialState = {
  isFetching: false,
  isAuthenticated: !!localStorage.getItem('token'),
  receivedAt: null,
  errorMessage: null,
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
      return {
        ...state,
        isAuthenticated: false,
      };
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
    case SET_ERROR_MESSAGE:
      return {
        ...state,
        errorMessage: action.message,
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
 * getUserGroup selector
 * @param {object} state
 * @returns {string} current user group
 */
export const getUserGroup = createSelector(
  state => state.authentication.payload && state.authentication.payload.user,
  // Temporary we get first item
  // TODO: find a way to implement authorization with multiple groups
  user => user && user.groups[0],
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
export function setErrorMessage (errorMessage) {
  return {
    type: SET_ERROR_MESSAGE,
    errorMessage,
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

  return apiService.refreshToken(token)
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
  // dispatch(setAuthentication());

  return apiService
    .login(email, password)
    .then(response => {
      dispatch(receiveToken());
      if (response && response.token) {
        tokenService.setToken(response.token);
        dispatch(setAuthentication());
        dispatch(enableTimerRefreshToken());
      }
    })
    .catch(error => {
      dispatch(receiveToken());
      dispatch(setErrorMessage(error));
    });
};
