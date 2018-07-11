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
    params,
  };
  next({
    type: requestType,
    endpoint,
    params,
  });
  if (form) {
    next(actions.setPending(form, true));
  }
  // Passing the authenticated boolean back in our data will
  // let us distinguish between normal and secret quotes
  let url = endpoint;
  if (params) {
    url += `?${queryString.stringify(params)}`;
  }
  return apiService.request(url, config)
    .then(response => {
      next({
        data: response.data,
        type: successType,
        endpoint,
        params,
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
