import initialState from 'modules/profile-initial';

export const UPDATE_PROPERTIES = 'profile/UPDATE_PROPERTIES';

/**
 * REDUCER
 * --------------------------------------------------------- *
 */
const profile = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_PROPERTIES:
      return {
        ...state,
        properties: {
          ...state.properties,
          ...action.properties,
        },
      };
    default:
      return state;
  }
};

export default profile;


/**
 * ACTIONS
 * --------------------------------------------------------- *
 */

/**
 * profile action
 * updateProfileProperties add or update an object of properties
 * @param  {object} properties : object of properties to add / update in profile object
 */
export const updateProfileProperties = properties => ({
  type: UPDATE_PROPERTIES,
  properties,
});
