import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import api from 'middlewares/api';
import FetchMock from 'fetch-mock';
import settings from 'front-settings';

import profile, {
  UPDATE_PROPERTIES,
  PROFILE_REQUEST,
  PROFILE_FAILURE,
  PROFILE_SUCCESS,
  submitProfile,
} from 'modules/profile';
import initialProfileState from 'modules/profile-initial';

const middlewares = [thunk, api];
const mockStore = configureMockStore(middlewares);
const initialState = 'modules/profile-initial';

describe('profile reducer', () => {
  it('should have initial value equal to {}', () => {
    expect(profile({}, {})).toEqual({});
  });

  describe('UPDATE_PROPERTIES', () => {
    it('should add a properties object in profile', () => {
      const updatePropertiesAction = {
        type: UPDATE_PROPERTIES,
        properties: {
          firstname: 'San',
          lastname: 'goku',
        },
      };

      expect(profile({}, updatePropertiesAction)).toEqual({
        properties: { ...initialProfileState.properties, firstname: 'San', lastname: 'goku' },
      });
    });
  });
});

describe('profile async action', () => {
  it('should PROFILE_REQUEST, then if success PROFILE_SUCCESS', () => {
    const store = mockStore(initialState);

    FetchMock.put('*', { email: 'test@mailTest.com' });

    return store.dispatch(submitProfile('test@mailTest.com'))
      .then(() => {
        const actions = store.getActions();
        expect(actions).toContainEqual({
          type: PROFILE_REQUEST,
          endpoint: '/accounts/user/',
        });

        expect(actions).toContainEqual({
          type: PROFILE_SUCCESS,
          data: { email: 'test@mailTest.com' },
          endpoint: '/accounts/user/',
        });
      });
  });

  it('should PROFILE_REQUEST, then if failed PROFILE_FAILED', () => {
    const store = mockStore(initialState);

    FetchMock.put('*', 400, { overwriteRoutes: true });

    return store.dispatch(submitProfile('Bonjour', null))
      .then(() => {
        const actions = store.getActions();
        expect(actions).toContainEqual({ type: PROFILE_REQUEST, endpoint: '/accounts/user/' });

        expect(actions).toContainEqual({
          error: {
            message: undefined,
            status: 400,
            url: `${settings.API_URL}/accounts/user/`,
          },
          type: PROFILE_FAILURE,
        });
      });
  });
});
