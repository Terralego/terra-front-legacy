import { CALL_API } from 'middlewares/api';

export const SIGNUP_REQUEST = 'userrequest/SIGNUP_REQUEST';
export const SIGNUP_SUCCESS = 'userrequest/SIGNUP_SUCCESS';
export const SIGNUP_FAILURE = 'userrequest/SIGNUP_FAILURE';

const initialState = {
  signupEmail: '',
};

/**
 * REDUCER
 * --------------------------------------------------------- *
 */
const signup = (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export default signup;

/**
 * SELECTORS
 * --------------------------------------------------------- *
 */


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
  },
});
