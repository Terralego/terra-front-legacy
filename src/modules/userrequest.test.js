import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import FetchMock from 'fetch-mock';
import api from 'middlewares/api';
import userrequest, {
  UPDATE_DATA_PROPERTIES,
  SUBMIT_REQUEST,
  SUBMIT_SUCCESS,
  SUBMIT_FAILURE,
  submitData,
  addOrUpdateGeojsonFeature,
  ADD_GEOJSON_FEATURE,
  deleteGeojsonFeature,
  DELETE_GEOJSON_FEATURE,
} from './userrequest';

import initialState from './userrequest-initial';

const middlewares = [thunk, api];
const mockStore = configureMockStore(middlewares);

describe('userrequest reducer', () => {
  it('should have initial value equal to {}', () => {
    expect(userrequest({}, {})).toEqual({});
  });

  describe('UPDATE_DATA_PROPERTIES', () => {
    it('should add a properties object in userrequest', () => {
      const updateRequestAction = {
        type: UPDATE_DATA_PROPERTIES,
        properties: {
          name: 'Alex',
          company: 'Makina',
        },
      };
      expect(userrequest({}, updateRequestAction)).toEqual({
        properties: { name: 'Alex', company: 'Makina' },
      });
    });
  });
});

describe('userrequest async action', () => {
  it('should SUBMIT_REQUEST, then if success SUBMIT_SUCCESS', () => {
    const store = mockStore(initialState);

    FetchMock.post('*', { id: 'Hello' });

    return store.dispatch(submitData('Hello'))
      .then(() => {
        const actions = store.getActions();
        expect(actions).toContainEqual({
          type: SUBMIT_REQUEST,
          endpoint: '/userrequest/',
        });
        expect(actions).toContainEqual({
          type: SUBMIT_SUCCESS,
          data: { id: 'Hello' },
          endpoint: '/userrequest/',
        });
      });
  });

  it('should SUBMIT_REQUEST, then if failed SUBMIT_FAILURE', () => {
    const store = mockStore(initialState);

    FetchMock.post('*', 400, { overwriteRoutes: true });

    return store.dispatch(submitData('Bonjour', null))
      .then(() => {
        const actions = store.getActions();
        expect(actions).toEqual([
          { type: SUBMIT_REQUEST, endpoint: '/userrequest/' },
          {
            type: SUBMIT_FAILURE,
            error: {
              message: 'Une erreur est survenue',
            },
          },
        ]);
      });
  });
});

describe('addOrUpdateGeojsonFeature action', () => {
  const store = mockStore(initialState);

  const feature = {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [296901.1534161276, 6177142.792006604],
          [293682.1807408809, 6172947.158817668],
          [298797.40476574795, 6172191.693898978],
          [296901.1534161276, 6177142.792006604],
        ],
      ],
    },
    properties: {
      id: '3bc46e07-cc4f-1d1c-a16d-c32df381faba',
      name: 'Polygon',
    },
  };

  it('should dispatch a ADD_GEOJSON_FEATURE action type', () => {
    store.dispatch(addOrUpdateGeojsonFeature(feature));
    const actions = store.getActions();
    expect(actions[0].type).toEqual(ADD_GEOJSON_FEATURE);
  });

  it('should add a feature in geojson', () => {
    store.dispatch(addOrUpdateGeojsonFeature(feature));
    const actions = store.getActions();

    expect(userrequest(initialState, actions[0]).geojson).toEqual({
      type: 'FeatureCollection',
      features: [feature],
    });
  });
});

describe('deleteGeojsonFeature action', () => {
  const store = mockStore({
    geojson: {
      type: 'FeatureCollection',
      features: [{
        properties: { id: 'a', name: 'Polygon' },
      }, {
        properties: { id: 'b', name: 'Polygon' },
      }, {
        properties: { id: 'c', name: 'Polygon' },
      }],
    },
  });

  it('should dispatch a DELETE_GEOJSON_FEATURE action type', () => {
    store.dispatch(deleteGeojsonFeature('b'));
    const actions = store.getActions();
    expect(actions[0].type).toEqual(DELETE_GEOJSON_FEATURE);
  });

  it('should add a feature in geojson', () => {
    store.dispatch(deleteGeojsonFeature('b'));
    const actions = store.getActions();

    expect(userrequest(store.getState(), actions[0]).geojson).toEqual({
      type: 'FeatureCollection',
      features: [{
        properties: { id: 'a', name: 'Polygon' },
      }, {
        properties: { id: 'c', name: 'Polygon' },
      }],
    });
  });
});
