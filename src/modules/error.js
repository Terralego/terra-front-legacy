import {
  SAVE_DRAFT_FAILURE,
  SUBMIT_FAILURE,
  INTERSECT_FAILURE,
} from 'modules/userrequest';
import {
  DETAIL_FAILURE,
} from 'modules/userrequestList';
import { SET_ERROR_MESSAGE } from 'modules/authentication';
import { CONFIG_FAILURE } from 'modules/appConfig';

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
    case CONFIG_FAILURE:
      return action.error;
    case SET_ERROR_MESSAGE:
      return action.errorMessage;
    default:
      return state;
  }
};

export default errors;

