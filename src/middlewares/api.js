import Symbol from 'es6-symbol/polyfill';

import apiService from 'services/apiService';
import { actions } from 'react-redux-form';
import queryString from 'query-string';

export const CALL_API = Symbol('Call API');

export default () => next => action => {
  const callAPI = action[CALL_API];

  // So the middleware doesn't get applied to every single action
  if (typeof callAPI === 'undefined') {
    return next(action);
  }

  const { endpoint, params, types, config, form } = callAPI;
  const [requestType, successType, errorType] = types;
  const payload = {
    endpoint,
  };
  // Passing the authenticated boolean back in our data will
  // let us distinguish between normal and secret quotes
  let url = endpoint;
  if (params) {
    url += `?${queryString.stringify(params)}`;
    payload.params = params;
  }
  next({
    type: requestType,
    ...payload,
  });
  if (form) {
    next(actions.setPending(form, true));
  }
  return apiService.request(url, config)
    .then(response => {
      next({
        data: response.data,
        type: successType,
        ...payload,
      });
      if (form) {
        next(actions.setPending(form, false));
        next(actions.setSubmitted(form, true));
      }
    })
    .catch(error => {
      if (error instanceof Error) {
        next({
          error: { message: 'Une erreur est survenue' },
          type: errorType,
        });
      } else {
        next({ error, type: errorType });
      }
      if (form) {
        next(actions.setPending(form, false));
        next(actions.setSubmitFailed(form));
      }
    });
};
