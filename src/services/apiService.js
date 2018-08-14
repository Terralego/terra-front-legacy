import 'whatwg-fetch';
import settings from 'front-settings';
import tokenService from 'services/tokenService';
import i18next from 'i18next';

async function handleErrors (response) {
  const data = await response.json();

  if (response.status >= 200 && response.status < 300) {
    return data;
  }

  let errorCode = response.status;

  if (data.password) {
    errorCode = 'password';
  }
  if (data.username) {
    errorCode = 'username';
  }
  if (data.email) {
    errorCode = 'email';
  }
  if (data.non_field_errors
    && data.non_field_errors.length > 0) {
    errorCode = 'authentication';
  }

  const error = {
    message: i18next.t([`error:${errorCode}`, 'error:unspecific']),
    ...response,
  };

  throw error;
}

export const defaultHeaders = {
  'Content-Type': 'application/json',
};

export default {
  /**
   * getFreshToken
   */
  getFreshToken: async token =>
    handleErrors(await fetch(`${settings.API_URL}/auth/refresh-token/`, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify({ token }),
    })),

  /**
   * login
   * @param {string} email
   * @param {string} password
   */
  login: async (email, password) =>
    handleErrors(await fetch(`${settings.API_URL}/auth/obtain-token/`, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify({ email, password }),
    })),

  /**
   * request
   * @param  {string} endpoint
   * @param  {object} config
   */
  request: async (endpoint, config) => {
    const headers = {};
    const token = tokenService.getToken();

    if (token) {
      headers.Authorization = `JWT ${token}`;
    }

    return handleErrors(await fetch(`${settings.API_URL}${endpoint}`, {
      method: 'GET',
      ...config,
      headers: {
        ...headers,
        ...config.headers,
      },
    }))
      .then(response => ({ data: response }));
  },
};
