import {
  getReviewersByUuid,
  getReviewer,
  getFeaturesWithIncidence,
  getUserrequestWithFeatureId,
} from './userrequestHelpers';

import mockFeatures from './__mocks__/features.json';
import mockIntersection1 from './__mocks__/intersect_response_1.json';
import mockIntersection2 from './__mocks__/intersect_response_2.json';
import mockIntersection3 from './__mocks__/intersect_response_3.json';

const reviewers = [
  {
    id: 146,
    email: 'GELE@onf.fr',
    uuid: 'a',
  },
  {
    id: 138,
    email: 'BUTIN@onf.fr',
    uuid: 'b',
  },
  {
    id: 139,
    email: 'CALBO@onf.fr',
    uuid: 'c',
  },
];

describe('getReviewersByUuid', () => {
  it('should return an object of reviewers', () => {
    expect(getReviewersByUuid(reviewers)).toEqual({
      a: {
        id: 146,
        email: 'GELE@onf.fr',
        uuid: 'a',
      },
      b: {
        id: 138,
        email: 'BUTIN@onf.fr',
        uuid: 'b',
      },
      c: {
        id: 139,
        email: 'CALBO@onf.fr',
        uuid: 'c',
      },
    });
  });
});

describe('getReviewer', () => {
  it('should return reviewer a', () => {
    expect(getReviewer(reviewers, 'a')).toEqual({
      id: 146,
      email: 'GELE@onf.fr',
      uuid: 'a',
    });
  });
});

describe('getFeaturesWithIncidence', () => {
  it('should return features array if no incidence provide', () => {
    expect(getFeaturesWithIncidence(null, mockFeatures)).toEqual(mockFeatures);
  });

  it('should return an array of feature with incidences 1', () => {
    expect(getFeaturesWithIncidence(mockIntersection1, mockFeatures)).toEqual([
      {
        type: 'Feature',
        id: 'a',
        properties: {
          incidence: { GRIDCODE: 1,
            date_from: '04-01',
            date_to: '07-31' },
        },
      },
      {
        type: 'Feature',
        id: 'b',
      },
      {
        type: 'Feature',
        id: 'c',
      },
      {
        type: 'Feature',
        id: 'd',
      },
      {
        type: 'Feature',
        id: 'e',
      },
    ]);
  });
  it('should return an array of feature with incidences 2', () => {
    expect(getFeaturesWithIncidence(mockIntersection2, mockFeatures)).toEqual([

      {
        type: 'Feature',
        id: 'a',
      },
      {
        type: 'Feature',
        id: 'b',
        properties: {
          incidence: { GRIDCODE: 3,
            date_from: '04-01',
            date_to: '07-31' },
        },
      },
      {
        type: 'Feature',
        id: 'c',
      },
      {
        type: 'Feature',
        id: 'd',
      },
      {
        type: 'Feature',
        id: 'e',
      },
    ]);
  }); it('should return an array of feature with incidences 3', () => {
    expect(getFeaturesWithIncidence(mockIntersection3, mockFeatures)).toEqual([

      {
        type: 'Feature',
        id: 'a',
      },
      {
        type: 'Feature',
        id: 'b',
      },
      {
        type: 'Feature',
        id: 'c',
        properties: {
          incidence: { GRIDCODE: 4,
            date_from: '04-01',
            date_to: '07-31' },
        },
      },
      {
        type: 'Feature',
        id: 'd',
      },
      {
        type: 'Feature',
        id: 'e',
      },
    ]);
  });
});

describe('getUserrequestWithFeatureId', () => {
  const userrequestWithFeature = {
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

  const userrequestWithoutFeature = {
    geojson: {
      features: [],
    },
  };
  it('should return same data if no features provide', () => {
    expect(getUserrequestWithFeatureId(userrequestWithoutFeature)).toEqual(userrequestWithoutFeature);
  });

  it('should return features with id', () => {
    expect(getUserrequestWithFeatureId(userrequestWithFeature)).toEqual({
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
