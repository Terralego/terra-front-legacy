import {
  SAVE_DRAFT_FAILURE,
  SUBMIT_FAILURE,
  EXISTING_FAILURE,
  INTERSECT_FAILURE,
} from 'modules/userrequest';
import { SET_ERROR_MESSAGE } from 'modules/authentication';

const initialState = null;

/**
 * REDUCER
 * --------------------------------------------------------- *
 */
const errors = (state = initialState, action) => {
  switch (action.type) {
    case SAVE_DRAFT_FAILURE:
    case SUBMIT_FAILURE:
    case EXISTING_FAILURE:
    case INTERSECT_FAILURE:
      return action.error;
    case SET_ERROR_MESSAGE:
      return action.errorMessage;
    default:
      return state;
  }
};

export default errors;

