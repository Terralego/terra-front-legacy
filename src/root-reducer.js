import { combineReducers } from 'redux';
import appConfig from 'modules/appConfig';
import userrequest from 'modules/userrequest';
import userrequestList from 'modules/userrequestList';
import userrequestComment from 'modules/userrequestComment';
import userrequestCommentList from 'modules/userrequestCommentList';
import authentication from 'modules/authentication';
import authenticationTimer from 'modules/authenticationTimer';
import featureAuthorisations from 'modules/featureAuthorisations';
import profile from 'modules/profile';
import error from 'modules/error';
import account from 'modules/account';
import { createForms } from 'react-redux-form';

export const reducers = {
  ...createForms({
    userrequest,
    userrequestComment,
    profile,
    account,
    login: {
      email: '',
      password: '',
    },
  }),
  featureAuthorisations,
  userrequestCommentList,
  appConfig,
  userrequestList,
  authentication,
  authenticationTimer,
  error,
};

export default combineReducers(reducers);
