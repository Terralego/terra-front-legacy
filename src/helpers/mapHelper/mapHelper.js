/**
  * Get the feature type
  * @param {String} type
  * @return {String} : return the selection's type
 */
export const getFeatureType = type => {
  switch (type) {
    case 'Polygon':
      return 'Zone';
    case 'Point':
      return 'Point';
    default:
      return 'Selection';
  }
};

export default getFeatureType;
