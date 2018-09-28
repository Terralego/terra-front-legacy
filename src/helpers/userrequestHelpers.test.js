import {
  getReviewersByUuid,
  getReviewer,
  getFeaturesWithIncidence,
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

const incidence = { GRIDCODE: 0 };

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
        properties: { incidence },
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
        properties: { incidence },
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
        properties: { incidence },
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

