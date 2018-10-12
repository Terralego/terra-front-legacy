import { CALL_API } from 'middlewares/api';
import { defaultHeaders } from 'services/apiService';

// Default aut action
const SET_DEFAULT_AUT_PROPERTY = 'SET_DEFAULT_AUT_PROPERTY';

// Action to change the value of the key property
const CHANGE_AUT_PROPERTY = 'CHANGE_AUT_PROPERTY';

// Update features properties actions
const UPDATE_FEATURES_REQUEST = 'feature_authorisations/UPDATE_FEATURES_REQUEST';
const UPDATE_FEATURES_SUCCESS = 'feature_authorisations/UPDATE_FEATURES_SUCCESS';
const UPDATE_FEATURES_FAILURE = 'feature_authorisations/UPDATE_FEATURES_FAILURE';

const initialState = {
  authorisations: {
    AUT_CYC: {
      value: 0,
      label: 'Autoriser cyclisme',
    },
    BAL_CYC: {
      value: 0,
      label: 'Baliser cyclisme',
    },
    AUT_EQU: {
      value: 0,
      label: 'Autoriser équestre',
    },
    BAL_EQU: {
      value: 0,
      label: 'Baliser équestre',
    },
    BAL_PED: {
      value: 0,
      label: 'Balisé pédestre',
    },
  },
};

/**
 * REDUCER
 * --------------------------------------------------------- *
 */
const featureAuthorisations = (state = initialState, action) => {
  switch (action.type) {
    case SET_DEFAULT_AUT_PROPERTY:
      return {
        ...state,
        authorisations: {
          ...state.authorisations,
          AUT_CYC: {
            ...state.authorisations.AUT_CYC,
            value: action.properties.AUT_CYC,
          },
          BAL_CYC: {
            ...state.authorisations.BAL_CYC,
            value: action.properties.BAL_CYC,
          },
          AUT_EQU: {
            ...state.authorisations.AUT_EQU,
            value: action.properties.AUT_EQU,
          },
          BAL_EQU: {
            ...state.authorisations.BAL_EQU,
            value: action.properties.BAL_EQU,
          },
          BAL_PED: {
            ...state.authorisations.BAL_PED,
            value: action.properties.BAL_PED,
          },
        },
      };
    case CHANGE_AUT_PROPERTY:
      return {
        ...state,
        authorisations: {
          ...state.authorisations,
          [action.key]: {
            ...state.authorisations[action.key],
            value: state.authorisations[action.key].value ? 0 : 1,
          },
        },
      };
    default:
      return state;
  }
};

export default featureAuthorisations;


/**
 * ACTIONS
 * --------------------------------------------------------- *
 */

/**
 * Set default properties
 * @param {object} properties
 */
export const setDefaultAutProperty = properties => ({
  type: SET_DEFAULT_AUT_PROPERTY,
  properties,
});

/**
 * Change the value of the key property
 * @param {string} key
 */
export const changeAutProperty = key => ({
  type: CHANGE_AUT_PROPERTY,
  key,
});

/**
 * Send feature with properties updated
 * @param {object} feature
 * @param {object} newProperties
 */
export const sendFeatures = feature => (dispatch, getState) => {
  const newFeature = {
    ...feature,
    properties: {
      ...feature.properties,
      ...Object.keys(getState().featureAuthorisations.authorisations)
        .reduce(key => ({ [key]: key.value }), {}),
    },
  };
  console.log(newFeature);
  return ({
    [CALL_API]: {
      endpoint: 'Un endpoint que va me filer nahuel!',
      type: [UPDATE_FEATURES_REQUEST, UPDATE_FEATURES_SUCCESS, UPDATE_FEATURES_FAILURE],
      config: {
        headers: defaultHeaders,
        method: 'POST',
        body: JSON.stringify({
          newFeature,
        }),
      },
    },
  });
};
