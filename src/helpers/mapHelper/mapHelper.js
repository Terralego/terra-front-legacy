import moment from 'moment';
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

/**
 * getActivityFeatures
 * Given an array of features and an activity id,
 * filter all features to return only activity features
 *
 * @param {array} features
 * @param {string} activity id
 * @returns {array} array of activity features
 */
export function getActivityFeatures (features, activityId) {
  return features.filter(feature => feature.properties.activity === activityId);
}

/**
 * getAllDates
 * Given an array of date object (startDate, endDate,...)
 * return an array with all dates
 *
 * @param {array} dates array of dates objects
 * @returns {array} array of dates
 */
export const getAllDates = dates => (
  dates
    .reduce((acc, curr) => ([
      ...acc,
      curr.startDate,
      curr.endDate,
    ]), [])
    .filter(date => moment(date).isValid())
);

/**
 * getActivityExtent
 * Given an array of date range (first, last),
 * return the first in the list
 *
 * @param {array} dates
 * @returns {date} first date of activity
 */
export const getActivityExtent = dates => {
  if (!dates.length) {
    return '';
  }

  dates
    .map(date => moment(date))
    .sort((a, b) => a.isBefore(b));

  return [moment(dates.shift()), moment(dates.pop())];
};

export const getDateForQueryString = (date, defaultValue) => (
  moment(date).isValid() ? moment(date).format('YYYY-MM-DD') : defaultValue.format('YYYY-MM-DD')
);

/**
 * getDatesQueryOptions
 * Return a query string with from to activity dates
 *
 * @param {array} dates
 * @returns {string} query parameter with 'from' 'to'
 */
export const getDatesQueryOptions = dates => {
  if (!dates) {
    return '';
  }

  const allDates = getAllDates(dates);
  const [startDate, endDate] = getActivityExtent(allDates);

  let queryParams = `?from=${getDateForQueryString(startDate, moment())}`;

  if (endDate) {
    queryParams += `&to=${getDateForQueryString(endDate, moment())}`;
  }

  return queryParams;
};

export default getFeatureType;