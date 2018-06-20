import { CALL_API } from 'middlewares/api';

export const REQUEST_ALL = 'userrequestList/REQUEST_ALL';
export const SUCCESS_ALL = 'userrequestList/SUCCESS_ALL';
export const FAILURE_ALL = 'userrequestList/FAILURE_ALL';
export const REQUEST_DETAIL = 'userrequestList/REQUEST_DETAIL';
export const SUCCESS_DETAIL = 'userrequestList/SUCCESS_DETAIL';
export const FAILURE_DETAIL = 'userrequestList/FAILURE_DETAIL';

// Change userrequest status
export const REQUEST_STATE_CHANGE = 'userrequestList/REQUEST_STATE_CHANGE';
export const SUCCESS_STATE_CHANGE = 'userrequestList/SUCCESS_STATE_CHANGE';
export const FAILURE_STATE_CHANGE = 'userrequestList/FAILURE_STATE_CHANGE';

// Change userrequest status
export const REQUEST_APPROBATIONS_CHANGE = 'userrequestList/REQUEST_APPROBATIONS_CHANGE';
export const SUCCESS_APPROBATIONS_CHANGE = 'userrequestList/SUCCESS_APPROBATIONS_CHANGE';
export const FAILURE_APPROBATIONS_CHANGE = 'userrequestList/FAILURE_APPROBATIONS_CHANGE';

const initialState = {
  items: {},
  loading: false,
};

const getItemsFromResponse = response => {
  if (!response.results || response.results.length < 1) {
    return null;
  }
  const items = {};
  response.results.forEach(userrequest => {
    items[userrequest.id] = userrequest;
  });
  return items;
};

/**
 * userrequestList reducer
 */
const userrequestList = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST_ALL:
      return {
        ...state,
        loading: true,
      };
    case SUCCESS_ALL:
      return {
        ...state,
        loading: false,
        items: getItemsFromResponse(action.data),
      };
    case REQUEST_DETAIL:
      return {
        ...state,
        loading: true,
      };
    case SUCCESS_DETAIL:
      return {
        ...state,
        loading: false,
        items: {
          ...state.items,
          [action.data.id]: action.data,
        },
      };
    case SUCCESS_STATE_CHANGE:
    case SUCCESS_APPROBATIONS_CHANGE:
      return {
        ...state,
        items: {
          ...state.items,
          [action.data.id]: action.data,
        },
      };
    default:
      return state;
  }
};

export default userrequestList;


/**
 * userrequestList action : fetch userrequest list
 */
export const getUserrequestList = () => ({
  [CALL_API]: {
    endpoint: '/userrequest/',
    types: [REQUEST_ALL, SUCCESS_ALL, FAILURE_ALL],
    config: { method: 'GET' },
  },
});

/**
 * userrequest action : fetch userrequest
 * @param {string} id
 */
export const getUserrequest = id => ({
  [CALL_API]: {
    endpoint: `/userrequest/${id}`,
    types: [REQUEST_DETAIL, SUCCESS_DETAIL, FAILURE_DETAIL],
    config: { method: 'GET' },
  },
});

/**
 * userrequest action : update state of a userrequest
 * @param {number} id - id of the userrequest
 * @param {number} state - state of the userrequest
 */
export const updateState = (id, state) => ({
  [CALL_API]: {
    endpoint: `/userrequest/${id}/`,
    types: [REQUEST_STATE_CHANGE, SUCCESS_STATE_CHANGE, FAILURE_STATE_CHANGE],
    config: {
      method: 'PATCH',
      body: JSON.stringify({
        state,
      }),
    },
  },
});

/**
 * updateStateAndApprobations action : update state of a userrequest
 * @param {object} userrequest - data that we wan't change approbations
 * @param {number} status - N2 approbation status
 * @param {string} userUuid - uuid of N1 that request approbation
 */
export const updateStateAndApprobation = (data, status, userUuid) => ({
  [CALL_API]: {
    endpoint: `/userrequest/${data.id}/`,
    types: [REQUEST_STATE_CHANGE, SUCCESS_STATE_CHANGE, FAILURE_STATE_CHANGE],
    config: {
      method: 'PATCH',
      body: JSON.stringify({
        state: status,
        properties: {
          ...data.properties,
          approbations: {
            ...data.properties.approbations,
            [userUuid]: status,
          },
        },
      }),
    },
  },
});

/**
 * userrequest action : update approbation status from N1 user
 * @param {object} userrequest - data that we wan't change approbations
 * @param {number} status - N1 approbation status
 * @param {string} userUuid - uuid of N1 that request approbation
 */
export const updateApproved = (data, status, userUuid) => ({
  [CALL_API]: {
    endpoint: `/userrequest/${data.id}/`,
    types: [REQUEST_APPROBATIONS_CHANGE, SUCCESS_APPROBATIONS_CHANGE, FAILURE_APPROBATIONS_CHANGE],
    config: {
      method: 'PATCH',
      body: JSON.stringify({
        properties: {
          ...data.properties,
          approbations: {
            ...data.properties.approbations,
            [userUuid]: status,
          },
        },
      }),
    },
  },
});
