import guid from 'helpers/guidHelpers';
import getIncidencePeriods from 'helpers/incidencePeriodHelpers';

/**
 * Creation of an initial gricode equal to zero, while mapping through the features
 * collection this gridcode will be increased each time we meet a more restrictive gridcode.
 * We finally return the most restrictive gridcode.
 *
 * @param  {object} response : response sent back after the post of the feature
 * @param  {Array} features : the feature, we want obtain the gridcode
 * @return {Array} the feature with this incidence
 */
export const getFeaturesWithIncidence = (response, features, eventDates) => {
  if (!response || !response.results || response.results.length < 1) {
    return features;
  }

  let incidencePeriods = 0;
  if (eventDates && eventDates.length) {
    incidencePeriods = getIncidencePeriods(eventDates);
  }

  return features.map(feature => {
    let incidence = { GRIDCODE: 0 };
    if (feature.id !== response.request.callbackid) {
      return feature;
    }
    response.results.features.forEach(intersection => {
      if (incidencePeriods) {
        incidence = Object.keys(incidencePeriods).reduce((acc, key) => {
          if (intersection.properties[key] > incidence.GRIDCODE) {
            return { ...acc, GRIDCODE: intersection.properties[key] };
          }
          return { ...acc };
        }, incidence);
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
export const getRoutedFeaturesProperties = (features, featureId, routedFeatures) => {
  // Get origin draw properties
  const { properties } = getFeatureById(features, featureId);
  return routedFeatures.map(feature => {
    const id = guid();
    return {
      ...feature,
      id,
      properties: {
        ...properties,
        ...feature.properties,
        // Set routing id (to avoid duplicate id with origin draw)
        id,
        // Reference to origin draw id
        relatedFeatureId: properties.id,
        routeInProgress: false,
      },
    };
  });
};

/**
 * Return routedFeatures with matching properties
 *
 * @param {array} stateFeatures - default state features
 * @param {string} featureId - id of origin draw feature (callbackid of routing response)
 * @param {object} routedFeature - feature in response of routing request (expect a LineString)
 */
export const getRoutedFeatures = (stateFeatures, featureId, routedFeatures) => {
  const routedFeaturesWithProperties =
    getRoutedFeaturesProperties(stateFeatures, featureId, routedFeatures);

  const filterStateFeatures = stateFeatures.filter(feature =>
    feature.properties.relatedFeatureId !==
    routedFeaturesWithProperties[0].properties.relatedFeatureId);

  const setRelatedFeatureId = feature => {
    if (feature.properties.id === featureId) {
      return {
        ...feature,
        properties: {
          ...feature.properties,
          relatedFeatureId: routedFeaturesWithProperties[0].id,
        },
      };
    }

    return feature;
  };

  return [
    ...filterStateFeatures.map(setRelatedFeatureId),
    ...routedFeaturesWithProperties,
  ];
};
/**
 * Return features list without requested delete id
 *
 * @param {array} features - array of features
 * @param {array} featuresId - array of feature ids to delete
 * @returns array of features
 */
export const deleteFeatureWithRoute = (features, featuresId) => {
  const featuresToDelete = [...featuresId, ...features.map(feature => {
    const isLineString = feature.properties.name === 'LineString';
    const isToDelete = featuresId.indexOf(feature.properties.relatedFeatureId) !== -1;

    return (isLineString && isToDelete)
      ? feature.properties.id
      : undefined;
  })];

  return (features.filter(feature =>
    featuresToDelete.indexOf(feature.properties.id) === -1
    || featuresToDelete.indexOf(feature.properties.relatedFeatureId) === -1)
  );
};
