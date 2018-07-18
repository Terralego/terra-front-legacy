import { combineReducers } from 'redux';
import appConfig from 'modules/appConfig';
import userrequest from 'modules/userrequest';
import userrequestList, { userrequestPaginator } from 'modules/userrequestList';
import userrequestComments from 'modules/userrequestComments';
import authentication from 'modules/authentication';
import authenticationTimer from 'modules/authenticationTimer';
import profile from 'modules/profile';
import signup from 'modules/signup';
import error from 'modules/error';
import { createForms } from 'react-redux-form';

export default combineReducers({
  ...createForms({
    userrequest,
    userrequestComments,
    profile,
    signup,
    login: {
      email: '',
      password: '',
    },
  }),
  appConfig,
  userrequestList,
  authentication,
  authenticationTimer,
  error,
  pagination: combineReducers({
    userrequestList: userrequestPaginator.reducer,
  }),
});
