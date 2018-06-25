import 'whatwg-fetch';
import settings from 'front-settings';
import tokenService from 'services/tokenService';

async function handleErrors (response) {
  const data = await response.json();

  if (response.status >= 200 && response.status < 300) {
    return data;
  }

  const error = {
    message: response.statusText,
    status: response.status,
    url: response.url,
  };

  if (data.password) {
    error.message += `: Password : ${data.password[0]}`;
  }
  if (data.username) {
    error.message += `: Login : ${data.username[0]}`;
  }
  if (data.non_field_errors
    && data.non_field_errors.length > 0) {
    error.message += `: ${data.non_field_errors[0]}`;
  }

  throw error;
}

const options = {
  headers: {
    'Content-Type': 'application/json',
  },
};

export default {
  /**
   * refreshToken
   */
  refreshToken: async token =>
    handleErrors(await fetch(`${settings.API_URL}/auth/refresh-token/`, {
      method: 'POST',
      ...options,
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
      ...options,
      body: JSON.stringify({ email, password }),
    })),

  /**
   * request
   * @param  {string} endpoint
   * @param  {object} config
   */
  request: async (endpoint, config) =>
    handleErrors(await fetch(`${settings.API_URL}${endpoint}`, {
      method: 'GET',
      ...options,
      headers: {
        ...options.headers,
        Authorization: `JWT ${tokenService.getToken()}`,
      },
      ...config,
    }))
      .then(response => ({ data: response })),
};
