import { getReviewersByUuid, getReviewer } from './userrequestHelpers';

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
