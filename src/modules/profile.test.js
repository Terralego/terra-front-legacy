import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import api from 'middlewares/api';

import profile, { UPDATE_PROPERTIES } from 'modules/profile';

const middlewares = [thunk, api];
const mockStore = configureMockStore(middlewares);

describe('profile reducer', () => {
  it('should have initial value equal to {}', () => {
    expect(profile({}, {})).toEqual({});
  });

  describe('UPDATE_PROPERTIES', () => {
    it('should add a properties object in profile', () => {
      const updatePropertiesAction = {
        type: UPDATE_PROPERTIES,
        properties: {
          name: 'San',
          lastname: 'goku',
        },
      };

      expect(profile({}, updatePropertiesAction)).toEqual({
        properties: { name: 'San', lastname: 'goku' },
      });
    });
  });
});
