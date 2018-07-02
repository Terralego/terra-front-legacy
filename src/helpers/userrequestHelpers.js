/**
 * Return an object with reviewers uuid as keys
 *
 * @param {array} reviewers
 * @returns {object}
 */
export const getReviewersByUuid = reviewers => {
  const reviewersObj = {};

  reviewers.forEach(reviewer => {
    reviewersObj[reviewer.uuid] = reviewer;
  });

  return reviewersObj;
};

/**
 * Return reviewer object, given an array of reviewers and uuid
 *
 * @param {array} reviewers
 * @param {string} uuid
 * @returns {object} reviewer object with corresponding uuid
 */
export const getReviewer = (reviewers, uuid) => getReviewersByUuid(reviewers)[uuid];
