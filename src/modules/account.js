import { CALL_API } from 'middlewares/api';

export const SIGNUP_REQUEST = 'userrequest/SIGNUP_REQUEST';
export const SIGNUP_SUCCESS = 'userrequest/SIGNUP_SUCCESS';
export const SIGNUP_FAILURE = 'userrequest/SIGNUP_FAILURE';

export const RESET_PASSWORD_REQUEST = 'userrequest/RESET_PASSWORD_REQUEST';
export const RESET_PASSWORD_SUCCESS = 'userrequest/RESET_PASSWORD_SUCCESS';
export const RESET_PASSWORD_FAILURE = 'userrequest/RESET_PASSWORD_FAILURE';

const initialState = {
  email: '',
  password: {
    new_password1: '',
    new_password2: '',
  },
};

/**
 * REDUCER
 * --------------------------------------------------------- *
 */
const account = (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export default account;


/**
 * ACTIONS
 * --------------------------------------------------------- *
 */

/**
 * signUp
 * @param  {string} email : singup email
 */
export const signUp = email => ({
  [CALL_API]: {
    endpoint: '/accounts/register/',
    types: [SIGNUP_REQUEST, SIGNUP_SUCCESS, SIGNUP_FAILURE],
    config: {
      method: 'POST',
      body: JSON.stringify({
        email,
      }),
    },
    form: 'signup',
  },
});

/**
 * resetPassword
 * @param  {string} uidb64 : uidb64 from api (send by mail to user)
 * @param  {string} token : token from api (send by mail to user)
 * @param  {object} password : password object (with password and confirmation)
 * @param  {string} password.new_password1 : password
 * @param  {string} password.new_password2 : password confirmation
 */
export const resetPassword = (password, uidb64Token = '') => ({
  [CALL_API]: {
    endpoint: `/accounts/change-password/reset/${uidb64Token}`,
    types: [RESET_PASSWORD_REQUEST, RESET_PASSWORD_SUCCESS, RESET_PASSWORD_FAILURE],
    config: {
      method: 'POST',
      body: JSON.stringify({
        ...password,
      }),
    },
    form: 'signup',
  },
});
