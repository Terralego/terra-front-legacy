import { getDataWithFeatureId } from './mapHelpers';

describe('getDataWithFeatureId', () => {
  const dataWithFeature = {
    geojson: {
      features: [
        {
          type: 'Feature',
          properties: {
            id: 'a',
          },
          geometry: {},
        },
      ],
    },
  };

  const dataWithoutFeature = {
    geojson: {
      features: [],
    },
  };
  it('should return same data if no features provide', () => {
    expect(getDataWithFeatureId(dataWithoutFeature))
      .toEqual(dataWithoutFeature);
  });

  it('should return features with id', () => {
    expect(getDataWithFeatureId(dataWithFeature)).toEqual({
      geojson: {
        features: [
          {
            type: 'Feature',
            id: 'a',
            properties: {
              id: 'a',
            },
            geometry: {},
          },
        ],
      },
    });
  });
});
