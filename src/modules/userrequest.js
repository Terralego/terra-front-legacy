import { CALL_API } from 'middlewares/api';
import moment from 'moment';

import initialState from 'modules/userrequest-initial';

export const UPDATE_DATA_PROPERTIES = 'userrequest/UPDATE_DATA_PROPERTIES';
export const ADD_GEOSJON_FEATURE = 'userrequest/ADD_GEOSJON_FEATURE';
export const REMOVE_GEOSJON_FEATURE = 'userrequest/REMOVE_GEOSJON_FEATURE';

// Save draft userrequest actions
export const SAVE_DRAFT = 'userrequest/SAVE_DRAFT';
export const SUCCESS_SAVE_DRAFT = 'userrequest/SUBMIT_DRAFT_SUCCESS';
export const FAILURE_SAVE_DRAFT = 'userrequest/SUBMIT_DRAFT_FAILED';

// Submit userrequest actions
export const SUBMIT_DATA = 'userrequest/SUBMIT_DATA';
export const SUCCESS_SUBMIT_DATA = 'userrequest/SUCCESS_SUBMIT_DATA';
export const FAILURE_SUBMIT_DATA = 'userrequest/FAILURE_SUBMIT_DATA';

// Get draft request actions
export const REQUEST_EXISTING = 'userrequestList/REQUEST_EXISTING';
export const SUCCESS_EXISTING = 'userrequestList/SUCCESS_EXISTING';
export const FAILURE_EXISTING = 'userrequestList/FAILURE_EXISTING';

export const POST_FEATURE = 'userrequest/POST_FEATURE';
export const SUCCESS_POST_FEATURE = 'userrequest/SUCCESS_POST_FEATURE';
export const FAILURE_POST_FEATURE = 'userrequest/FAILURE_POST_FEATURE';

// New userrequest
export const CLEAR = 'userrequestList/CLEAR';


const getFeaturesWithIncidence = () => {
  const incidenceList = [];
  // const featureIncidence = featuresIncidences[Math.floor(Math.random() * ((4 - 0) + 1)) + 0];
  featureIncidence.forEach(feature => {
    const infos = {
      gridcode: feature.properties[0].GRIDCODE,
      from: feature.properties[0].date_from,
      to: feature.properties[0].date_to,
    };
    incidenceList.push(infos);
  });
  //   let maxLevel = 0;
  //   const featureIncidence = incidenceList
  //     .map(item => {
  //       if (item.gridcode > maxLevel) {
  //         maxLevel = item.gridcode;
  //       }
  //       return item;
  //     })
  //     .find(item => item.gridcode === maxLevel);
  // return incidenceList;
};

// const getInfosIncidence = incidenceList => {
//   if (incidenceList.length < 1) {
//     return null;
//   }

//   return { ...warning[featureIncidence.gridcode], ...featureIncidence };
// };

/**
 * REDUCER
 * --------------------------------------------------------- *
 */
const userrequest = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_DATA_PROPERTIES:
      return {
        ...state,
        properties: {
          ...state.properties,
          ...action.properties,
        },
      };
    case ADD_GEOSJON_FEATURE:
      return {
        ...state,
        geojson: {
          ...state.geojson,
          features: [
            ...state.geojson.features,
            action.feature,
          ],
        },
      };
    case REMOVE_GEOSJON_FEATURE:
      return {
        ...state,
        geojson: {
          ...state.geojson,
          features: state.geojson.features
            .filter(feature => feature.properties.id !== action.featureId),
        },
      };
    case SUCCESS_SAVE_DRAFT:
      return {
        ...action.data,
      };
    case SUCCESS_EXISTING:
      return action.data;
    case CLEAR:
      return initialState;
    case SUCCESS_POST_FEATURE:
      return {
        ...state,
        // geometry: {

        // }
      };
    default:
      return state;
  }
};

export default userrequest;


/**
 * ACTIONS
 * --------------------------------------------------------- *
 */

/**
 * userrequest action
 * updateRequestProperties add or update an object of properties
 * @param  {object} properties : object of properties to add / update in userrequest object
 */
export const updateRequestProperties = properties => ({
  type: UPDATE_DATA_PROPERTIES,
  properties,
});

/**
 * userrequest action
 * addRequestFeature add or update an object of properties
 * @param  {object} properties : object of properties to add / update in userrequest object
 */
export const addRequestFeature = feature => ({
  type: ADD_GEOSJON_FEATURE,
  feature,
});

/**
 * userrequest action
 * removeRequestFeature remove or update an object of properties
 * @param  {object} properties : object of properties to remove / update in userrequest object
 */
export const removeRequestFeature = featureId => ({
  type: REMOVE_GEOSJON_FEATURE,
  featureId,
});

/**
 * userrequest action
 * clear userrequest to get a blank form
 */
export const clear = () => ({
  type: CLEAR,
});

/**
 * Submit data object
 * @param  {object} data : data that will be send to the server
 */
export const submitData = data => ({
  [CALL_API]: {
    endpoint: `/userrequest/${data.id ? `${data.id}/` : ''}`,
    types: [SUBMIT_DATA, SUCCESS_SUBMIT_DATA, FAILURE_SUBMIT_DATA],
    config: {
      method: data.id ? 'PUT' : 'POST',
      body: JSON.stringify({
        ...data,
        state: 200, // SUBMITTED
      }),
    },
    form: 'userrequest',
  },
});

/**
 * userrequest action : fetch userrequest
 * @param {string} id
 */
export const getUserrequest = id => ({
  [CALL_API]: {
    endpoint: `/userrequest/${id}`,
    types: [REQUEST_EXISTING, SUCCESS_EXISTING, FAILURE_EXISTING],
    config: { method: 'GET' },
  },
});

/**
 * userrequest action : save userrequest as draft
 * @param {string} data
 */
export const saveDraft = data => ({
  [CALL_API]: {
    endpoint: `/userrequest/${data.id ? `${data.id}/` : ''}`,
    types: [SAVE_DRAFT, SUCCESS_SAVE_DRAFT, FAILURE_SAVE_DRAFT],
    config: {
      method: data.id ? 'PUT' : 'POST',
      body: JSON.stringify(data),
    },
    form: 'userrequest',
  },
});

/**
 * Post feature object
 * @param  {object} feature : feature sent to the server
 * @param  {date} eventDateStart : Event start date
 * @param  {date} eventDateEnd : Event end date
 */
// export const getIntersections = (feature, eventDateStart, eventDateEnd) =>
//   // const params = [
//   //   `callbackid=${feature.properties.id}`,
//   //   `from=${eventDateStart || moment()}`,
//   //   `to=${eventDateEnd || moment()}`,
//   //   `geom=${JSON.stringify(feature.geometry)}`,
//   // ];
//   // const getQueryParams = params.join('&');

//   ({
//     [CALL_API]: {
//       endpoint: '/layer/reference/intersects/',
//       types: [POST_FEATURE, SUCCESS_POST_FEATURE, FAILURE_POST_FEATURE],
//       config: {
//         method: 'POST',
//         body: JSON.stringify({
//           callbackid: feature.properties.id,
//           from: eventDateStart,
//           to: eventDateEnd,
//           geom: feature.geometry,
//         }),
//       },
//     },
//   });

export const getIntersections = (feature, eventDateStart, eventDateEnd) => ({
  type: SUCCESS_POST_FEATURE,
  data: {
    request: {
      callbackid: feature.properties.id,
      geom: '{ "type": "LineString", "coordinates": [ [ 2.693259716033935, 48.391540991563879 ], [ 2.692251205444336, 48.387080959335698 ], [ 2.693002223968506, 48.386924209878941 ] ] }',
    },
    results: {
      type: 'FeatureCollection',
      crs: {
        type: 'name',
        properties: {
          name: 'EPSG:4326',
        },
      },
      features: [
        {
          type: 'Feature',
          properties: [
            {
              ID: 1065,
              RBI: 0,
              AUT_CYC: 0,
              AUT_EQU: 0,
              BAL_CYC: 0,
              BAL_EQU: 0,
              BAL_PED: 0,
              CCOD_FRT: 'FONT',
              CCOD_TRC: 856,
              DESSERTE: 'Sentier',
              GRIDCODE: 0,
              IIDT_TRC: 'FONT_00856',
              LLIB_VCI: 'Route de la Pompadour',
              CCOD_REVN: 'TN',
              LARGE_TRC: null,
              Shape_Leng: 260.500781,
              date_from: '04-01',
              date_to: '07-31',
            },
          ],
          geometry: {
            type: 'LineString',
            coordinates: [
              [
                2.6897315,
                48.3898563,
              ],
              [
                2.6897626,
                48.3898505,
              ],
              [
                2.693121,
                48.3892267,
              ],
            ],
          },
        },
        {
          type: 'Feature',
          properties: [
            {
              ID: 1065,
              RBI: 0,
              AUT_CYC: 1,
              AUT_EQU: 1,
              BAL_CYC: 0,
              BAL_EQU: 0,
              BAL_PED: 0,
              CCOD_FRT: 'FONT',
              CCOD_TRC: 4992,
              DESSERTE: 'Desserte',
              GRIDCODE: 0,
              IIDT_TRC: 'FONT_04992',
              LLIB_VCI: null,
              CCOD_REVN: 'TN',
              LARGE_TRC: '> 3,5 m',
              Shape_Leng: 264.66228,
              date_from: '04-01',
              date_to: '07-31',
            },
          ],
          geometry: {
            type: 'LineString',
            coordinates: [
              [
                2.6897315,
                48.3898563,
              ],
              [
                2.693303,
                48.3897508,
              ],
            ],
          },
        },
        {
          type: 'Feature',
          properties: [
            {
              ID: 1162,
              RBI: 0,
              AUT_CYC: 1,
              AUT_EQU: 1,
              BAL_CYC: 0,
              BAL_EQU: 0,
              BAL_PED: 0,
              CCOD_FRT: 'FONT',
              CCOD_TRC: 4994,
              DESSERTE: 'Desserte',
              GRIDCODE: 0,
              IIDT_TRC: 'FONT_04994',
              LLIB_VCI: 'Route de la Pompadour',
              CCOD_REVN: 'TN',
              LARGE_TRC: '> 3,5 m',
              Shape_Leng: 300.640251,
              date_from: '04-01',
              date_to: '07-31',
            },
          ],
          geometry: {
            type: 'LineString',
            coordinates: [
              [
                2.691791,
                48.3866854,
              ],
              [
                2.6919655,
                48.387037,
              ],
              [
                2.692124,
                48.3872551,
              ],
              [
                2.6922965,
                48.3874542,
              ],
              [
                2.6923976,
                48.3876344,
              ],
              [
                2.6924991,
                48.3878622,
              ],
              [
                2.6925862,
                48.38809,
              ],
              [
                2.6926741,
                48.3884224,
              ],
              [
                2.6927749,
                48.3885551,
              ],
              [
                2.6928758,
                48.3887164,
              ],
              [
                2.6930059,
                48.3889536,
              ],
              [
                2.693121,
                48.3892267,
              ],
            ],
          },
        },
        {
          type: 'Feature',
          properties: [
            {
              ID: 1162,
              GRIDCODE: 1,
              date_from: '04-01',
              date_to: '07-31',
            },
          ],
        },
        {
          type: 'Feature',
          properties: [
            {
              ID: 1166,
              GRIDCODE: 0,
              date_from: '04-01',
              date_to: '07-31',
            },
          ],
        },
      ],
    },
  },
});

