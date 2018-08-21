/**
 * Creation of an initial gricode equal to zero, while mapping through the features
 * collection this gridcode will be increased each time we meet a more restrictive gridcode.
 * We finally return the most restrictive gridcode.
 *
 * @param  {object} response : response sent back after the post of the feature
 * @param  {Array} features : the feature, we want obtain the gridcode
 * @return {Array} the feature with this incidence
 */
export const getFeaturesWithIncidence = (response, features) => {
  if (!response || !response.results || response.results.length < 1) {
    return features;
  }

  return features.map(feature => {
    let incidence = { GRIDCODE: 0 };
    if (feature.id !== response.request.callbackid) {
      return feature;
    }
    response.results.features.forEach(intersection => {
      if (intersection.properties[0].GRIDCODE > incidence.GRIDCODE) {
        incidence = {
          GRIDCODE: intersection.properties[0].GRIDCODE,
          date_from: intersection.properties[0].date_from,
          date_to: intersection.properties[0].date_to,
        };
      }
    });
    return {
      ...feature,
      properties: {
        ...feature.properties,
        incidence,

      },
    };
  });
};

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
export const getReviewer = (reviewers, uuid) => getReviewersByUuid(reviewers)[uuid] || {};

export const getUserrequestWithFeatureId = userrequest => ({
  ...userrequest,
  geojson: {
    ...userrequest.geojson,
    features: userrequest.geojson.features.map(feature => ({
      ...feature,
      id: feature.properties.id,
    })),
  },
});
