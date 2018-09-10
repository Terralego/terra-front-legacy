import {
  SAVE_DRAFT_FAILURE,
  SUBMIT_FAILURE,
  INTERSECT_FAILURE,
  READ_FAILURE,
  ROUTING_FAILURE,
} from 'modules/userrequest';
import {
  DETAIL_FAILURE,
} from 'modules/userrequestList';
import { AUTHENTICATION_FAILURE } from 'modules/authentication';
import { CONFIG_FAILURE } from 'modules/appConfig';
import { PROFILE_FAILURE } from 'modules/profile';
import { CHANGE_PASSWORD_FAILURE } from 'modules/account';

const initialState = null;

/**
 * REDUCER
 * --------------------------------------------------------- *
 */
const errors = (state = initialState, action) => {
  switch (action.type) {
    case SAVE_DRAFT_FAILURE:
    case SUBMIT_FAILURE:
    case DETAIL_FAILURE:
    case INTERSECT_FAILURE:
    case PROFILE_FAILURE:
    case CHANGE_PASSWORD_FAILURE:
    case CONFIG_FAILURE:
    case READ_FAILURE:
    case AUTHENTICATION_FAILURE:
    case ROUTING_FAILURE:
      return action.error;
    default:
      return state;
  }
};

export default errors;

