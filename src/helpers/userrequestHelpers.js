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
 * removeRouteInProgressDatas
 *
 * @param {object} data
 */
export const removeRouteInProgressDatas = data => ({
  ...data,
  geojson: {
    ...data.geojson,
    features: [
      ...data.geojson.features.filter(feature => !feature.properties.routeInProgress),
    ],
  },
});

/**
 * Return reviewer object, given an array of reviewers and uuid
 *
 * @param {array} reviewers
 * @param {string} uuid
 * @returns {object} reviewer object with corresponding uuid
 */
export const getReviewer = (reviewers, uuid) => getReviewersByUuid(reviewers)[uuid] || {};

/**
 * Return a feature by id
 *
 * @param {array} features
 * @param {string} id
 */
export const getFeatureById = (features, id) =>
  (features.find(feature => feature.properties.id === id));

/**
 * Get origin draw feature properties and reference it's id
 *
 * @param {array} features
 * @param {string} featureId - id of origin draw feature
 * @param {object} routedFeature - response of routing request (expect a LineString)
 * @returns feature object of routed feature (with origin feature properties)
 */
export const getRoutedFeatureProperties = (features, featureId, routedFeature) => {
  // Get origin draw properties
  const { properties } = getFeatureById(features, featureId);
  return {
    ...properties,
    // Set routing id (to avoid duplicate id with origin draw)
    id: routedFeature.id,
    // Reference to origin draw id
    relatedFeatureId: properties.id,
    routeInProgress: false,
  };
};

/**
 * Return routedFeatures with matching properties
 *
 * @param {array} stateFeatures - default state features
 * @param {string} featureId - id of origin draw feature (callbackid of routing response)
 * @param {object} routedFeature - feature in response of routing request (expect a LineString)
 */
export const getRoutedFeatures = (stateFeatures, featureId, routedFeature) => {
  const routedFeatureWithProperties =
    getRoutedFeatureProperties(stateFeatures, featureId, routedFeature);

  const setRelatedFeatureId = feature => {
    if (feature.properties.id === featureId) {
      return {
        ...feature,
        properties: {
          ...feature.properties,
          relatedFeatureId: routedFeatureWithProperties.id,
        },
      };
    }

    return feature;
  };
  const newStateFeatures = [
    ...stateFeatures.map(setRelatedFeatureId),
    {
      ...routedFeature,
      properties: routedFeatureWithProperties,
    },
  ];

  const hasNoRoutedFeature = p =>
    p.properties.relatedFeatureId !== routedFeatureWithProperties.relatedFeatureId;

  return ([
    ...newStateFeatures.filter(hasNoRoutedFeature),
    newStateFeatures.slice(-1)[0],
  ]);
};
/**
 * Return features list without requested delete id
 *
 * @param {array} features - array of features
 * @param {array} featuresId - array of feature ids to delete
 * @returns array of features
 */
export const deleteFeatureWithRoute = (features, featuresId) => (features.filter(feature =>
  featuresId.indexOf(feature.properties.id) === -1
  && featuresId.indexOf(feature.properties.relatedFeatureId) === -1)
);

/**
 * Generate new feature Id
 * @returns new feature ID
 */
export function guid () {
  function s4 () {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
}
