import { CALL_API } from 'middlewares/api';

export const SIGNUP_REQUEST = 'userrequest/SIGNUP_REQUEST';
export const SIGNUP_SUCCESS = 'userrequest/SIGNUP_SUCCESS';
export const SIGNUP_FAILURE = 'userrequest/SIGNUP_FAILURE';

export const CHANGE_PASSWORD_REQUEST = 'userrequest/CHANGE_PASSWORD_REQUEST';
export const CHANGE_PASSWORD_SUCCESS = 'userrequest/CHANGE_PASSWORD_SUCCESS';
export const CHANGE_PASSWORD_FAILURE = 'userrequest/CHANGE_PASSWORD_FAILURE';

export const NEW_PASSWORD_REQUEST = 'userrequest/NEW_PASSWORD_REQUEST';
export const NEW_PASSWORD_SUCCESS = 'userrequest/NEW_PASSWORD_SUCCESS';
export const NEW_PASSWORD_FAILURE = 'userrequest/NEW_PASSWORD_FAILURE';

const initialState = {
  email: '',
  password: {
    new_password1: '',
    new_password2: '',
  },
  signupError: '',
  emailSent: false,
  activated: false,
};

/**
 * REDUCER
 * --------------------------------------------------------- *
 */
const account = (state = initialState, action) => {
  switch (action.type) {
    case SIGNUP_SUCCESS:
      return {
        ...state,
        password: {
          new_password1: '',
          new_password2: '',
        },
        emailSent: true,
      };
    case SIGNUP_FAILURE:
      return {
        ...state,
        signupError: action.error.message,
      };
    case CHANGE_PASSWORD_SUCCESS:
      return {
        ...state,
        password: {
          new_password1: '',
          new_password2: '',
        },
        activated: true,
      };
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
    form: 'account',
  },
});

/**
 * newPassword set password for new account
 * @param  {string} uidb64 : uidb64 from api (send by mail to user)
 * @param  {string} token : token from api (send by mail to user)
 * @param  {object} password : password object (with password and confirmation)
 * @param  {string} password.new_password1 : password
 * @param  {string} password.new_password2 : password confirmation
 */
export const newPassword = (password, uidb64 = '', token = '') => ({
  [CALL_API]: {
    endpoint: `/accounts/change-password/reset/${uidb64}/${token}/`,
    types: [NEW_PASSWORD_REQUEST, NEW_PASSWORD_SUCCESS, NEW_PASSWORD_FAILURE],
    config: {
      method: 'POST',
      body: JSON.stringify({
        ...password,
      }),
    },
    form: 'account',
  },
});

/**
 * changePassword change password for existing account
 * @param  {object} password : password object (with password and confirmation)
 * @param  {string} password.new_password1 : password
 * @param  {string} password.new_password2 : password confirmation
 */
export const changePassword = password => ({
  [CALL_API]: {
    endpoint: '/accounts/change-password/reset/',
    types: [CHANGE_PASSWORD_REQUEST, CHANGE_PASSWORD_SUCCESS, CHANGE_PASSWORD_FAILURE],
    config: {
      method: 'POST',
      body: JSON.stringify({
        ...password,
      }),
    },
    form: 'account',
  },
});
