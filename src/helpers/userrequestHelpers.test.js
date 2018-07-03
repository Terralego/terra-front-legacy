import {
  getReviewersByUuid,
  getReviewer,
  getFeaturesWithIncidence,
} from './userrequestHelpers';

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

const mockFeatures = [
  {
    type: 'Feature',
    properties: { id: 'a' },
  },
  {
    type: 'Feature',
    properties: { id: 'b' },
  },
  {
    type: 'Feature',
    properties: { id: 'c' },
  },
  {
    type: 'Feature',
    properties: { id: 'd' },
  },
  {
    type: 'Feature',
    properties: { id: 'e' },
  },
];

describe('getFeaturesWithIncidence', () => {
  it('should return an array of feature with incidences 1', () => {
    expect(getFeaturesWithIncidence(mockIntersection1, mockFeatures)).toEqual([
      {
        type: 'Feature',
        properties: {
          id: 'a',
          incidence: { GRIDCODE: 1,
            date_from: '04-01',
            date_to: '07-31' },
        },
      },
      {
        type: 'Feature',
        properties: { id: 'b' },
      },
      {
        type: 'Feature',
        properties: { id: 'c' },
      },
      {
        type: 'Feature',
        properties: { id: 'd' },
      },
      {
        type: 'Feature',
        properties: { id: 'e' },
      },
    ]);
  });
  it('should return an array of feature with incidences 2', () => {
    expect(getFeaturesWithIncidence(mockIntersection2, mockFeatures)).toEqual([

      {
        type: 'Feature',
        properties: { id: 'a' },
      },
      {
        type: 'Feature',
        properties: {
          id: 'b',
          incidence: { GRIDCODE: 3,
            date_from: '04-01',
            date_to: '07-31' },
        },
      },
      {
        type: 'Feature',
        properties: { id: 'c' },
      },
      {
        type: 'Feature',
        properties: { id: 'd' },
      },
      {
        type: 'Feature',
        properties: { id: 'e' },
      },
    ]);
  }); it('should return an array of feature with incidences 3', () => {
    expect(getFeaturesWithIncidence(mockIntersection3, mockFeatures)).toEqual([

      {
        type: 'Feature',
        properties: { id: 'a' },
      },
      {
        type: 'Feature',
        properties: { id: 'b' },
      },
      {
        type: 'Feature',
        properties: {
          id: 'c',
          incidence: { GRIDCODE: 4,
            date_from: '04-01',
            date_to: '07-31' },
        },
      },
      {
        type: 'Feature',
        properties: { id: 'd' },
      },
      {
        type: 'Feature',
        properties: { id: 'e' },
      },
    ]);
  });
});