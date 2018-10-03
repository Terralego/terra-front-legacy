import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import FetchMock from 'fetch-mock';
import api from 'middlewares/api';
import userrequest, {
  UPDATE_DATA_PROPERTIES,
  submitData,
  updateFeatures,
  ADD_GEOJSON_FEATURE,
  deleteFeaturesById,
  DELETE_GEOJSON_FEATURES,
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

const data = {
  geojson: {
    features: [],
  },
  state: 200,
};

describe('userrequest async action', () => {
  it('should SUBMIT_REQUEST, then if success SUBMIT_SUCCESS', async () => {
    const store = mockStore({ userrequest: initialState });

    FetchMock.post('*', data);
    await submitData()(store.dispatch, store.getState);
    const actions = store.getActions();

    expect(actions.length).toBe(4);
    expect(actions[0]).toEqual({ type: 'rrf/setPending', model: 'userrequest', pending: true });
    expect(actions[1]).toEqual({ type: 'userrequest/SUBMIT_REQUEST' });
    expect(actions[2]).toEqual({ type: 'userrequest/SUBMIT_SUCCESS', data });
    expect(actions[3]).toEqual({ type: 'rrf/setSubmitted', model: 'userrequest', submitted: true });
  });

  it('should SUBMIT_REQUEST, then if failed SUBMIT_FAILURE', async () => {
    const store = mockStore({ userrequest: initialState });

    FetchMock.post('*', 400, { overwriteRoutes: true });

    await submitData()(store.dispatch, store.getState);
    const actions = store.getActions();
    expect(actions.length).toBe(3);
    expect(actions[0]).toEqual({ type: 'rrf/setPending', model: 'userrequest', pending: true });
    expect(actions[1]).toEqual({ type: 'userrequest/SUBMIT_REQUEST' });
    expect(actions[2]).toEqual({ type: 'userrequest/SUBMIT_FAILURE' });
  });
});

describe('updateFeatures action', () => {
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
    store.dispatch(updateFeatures(feature));
    const actions = store.getActions();
    expect(actions[0].type).toEqual(ADD_GEOJSON_FEATURE);
  });

  it('should add a feature in geojson', () => {
    store.dispatch(updateFeatures(feature));
    const actions = store.getActions();

    expect(userrequest(initialState, actions[0]).geojson).toEqual({
      type: 'FeatureCollection',
      features: [feature],
    });
  });
});

describe('deleteFeaturesById action', () => {
  const geojsonState = {
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
  };
  const store = mockStore(geojsonState);

  it('should dispatch a DELETE_GEOJSON_FEATURES action type', () => {
    const featuresToDelete = ['b'];
    store.dispatch(deleteFeaturesById(featuresToDelete));
    const actions = store.getActions();
    expect(actions[0].type).toEqual(DELETE_GEOJSON_FEATURES);
  });

  it('should have removed feature after DELETE_GEOJSON_FEATURES action', () => {
    const featuresToDelete = ['b'];
    store.dispatch(deleteFeaturesById(featuresToDelete));
    const actions = store.getActions();
    const state = userrequest(geojsonState, actions[0]);

    expect(state.geojson).toEqual({
      type: 'FeatureCollection',
      features: [{
        properties: { id: 'a', name: 'Polygon' },
      }, {
        properties: { id: 'c', name: 'Polygon' },
      }],
    });
  });
});
