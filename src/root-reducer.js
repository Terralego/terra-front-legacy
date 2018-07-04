import { combineReducers } from 'redux';
import appConfig from 'modules/appConfig';
import userrequest from 'modules/userrequest';
import userrequestList from 'modules/userrequestList';
import userrequestComments from 'modules/userrequestComments';
import authentication from 'modules/authentication';
import authenticationTimer from 'modules/authenticationTimer';
import profile from 'modules/profile';
import error from 'modules/error';
import { createForms } from 'react-redux-form';

export default combineReducers({
  ...createForms({
    userrequest,
    userrequestComments,
    login: {
      email: '',
      password: '',
    },
    profile,
  }),
  appConfig,
  userrequestList,
  authentication,
  authenticationTimer,
  error,
});
