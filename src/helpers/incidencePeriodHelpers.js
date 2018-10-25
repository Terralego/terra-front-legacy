import moment from 'moment';

export const april = 4;
export const august = 8;
export const september = 9;
export const october = 10;

export const NIGHT_START = 22;
export const NIGHT_START_WINTER = 19;
export const NIGHT_END = 5;
export const NIGHT_END_WINTER = 7;


const getActivityStartDate = activity =>
  activity.eventDates.reduce(
    (acc, eventDate) =>
      (moment(eventDate.dates[0].startDate).valueOf() < acc
        ? moment(eventDate.dates[0].startDate).valueOf()
        : acc
      )
    , +Infinity,
  );

export const getFirstDateFromActivities = activities =>
  moment(activities.reduce((acc, activity) => {
    const activityStartDate = getActivityStartDate(activity);
    if (activityStartDate < acc) return activityStartDate;
    return acc;
  }, +Infinity)).format();

const hasNightDate = date => {
  const month = moment(date).month() + 1;
  const day = moment(date).date();
  const isWinter =
    month < april
    || (month === april && day < 21)
    || month > september
    || (month === september && day > 21);

  const morningLimit = isWinter ? NIGHT_END_WINTER : NIGHT_END;
  const nightLimit = isWinter ? NIGHT_START_WINTER : NIGHT_START;
  return moment(date).hour() <= morningLimit || moment(date).hour() >= nightLimit;
};

const isSameDay = (firstDate, secondDate) =>
  moment(firstDate).dayOfYear() === moment(secondDate).dayOfYear();

const hasNightDates = dates =>
  dates.reduce((accum, { startDate, endDate }) => {
    const isNightDate = hasNightDate(startDate) || hasNightDate(endDate);
    const areSameDays = isSameDay(startDate, endDate);
    if (accum || isNightDate || !areSameDays) return true;
    return false;
  }, false);

const activityHasNightEvent = eventDates =>
  eventDates.reduce(
    (acc, eventDate) =>
      (!acc
        ? hasNightDates(eventDate.dates)
        : acc
      )
    , false,
  );

export const activitiesHasNightEvent = activities =>
  activities.reduce(
    (acc, { eventDates }) =>
      (!acc
        ? activityHasNightEvent(eventDates)
        : acc
      )
    , false,
  );


/**
 * Get all dates between start and end date
 * @param {Object or String} startDate
 * @param {Object or String} endDate
 */
export const enumerateMonthsBetweenDates = (startDate, endDate) => {
  const dates = [];

  const currDate = moment(startDate).startOf('month');
  const lastDate = moment(endDate).startOf('month');

  while (currDate.add(1, 'month').diff(lastDate) < 0) {
    dates.push(currDate.clone().toDate());
  }

  return dates;
};

/**
 * Get the incidence period
 * @param {Object or String} activityDate
 */
export const getIncidencePeriod = activityDate => {
  const month = moment(activityDate).format('MM');

  if (month >= april && month < august) { // Du 1er avril au 31 juillet
    return 'GRIDCODE2';
  }

  if (month >= august && month < october) { // Du 1er août au 31 septembre
    return 'GRIDCODE3';
  }

  // month >= august || month < april : Du 1er août au 31 mai
  return 'GRIDCODE1';
};

const mergeArrayOfPeriods = (acc, curr) => ({
  ...acc,
  ...Object.keys(curr)
    .reduce((ac, key) =>
      (curr[key]
        ? { ...ac, [key]: true }
        : { ...ac }), {}),
});

const getPeriodToCurrentDate = (acc, date) => {
  const allMonthsBetween = enumerateMonthsBetweenDates(date.startDate, date.endDate);

  return {
    ...acc,
    [getIncidencePeriod(date.startDate)]: true,
    [getIncidencePeriod(date.endDate)]: true,
    ...allMonthsBetween.reduce((ac, currDate) =>
      ({ ...ac, [getIncidencePeriod(currDate)]: true }), {}),
  };
};

/**
 * Get all activities periods
 * @param {Array} activityDates // Array of objects with dates array property
 */
export const getIncidencePeriods = (activityDates = [{ dates: [] }]) =>
  activityDates.map(activityDate => activityDate.dates
    .reduce(getPeriodToCurrentDate, { GRIDCODE1: false, GRIDCODE2: false, GRIDCODE3: false }))
    .reduce(mergeArrayOfPeriods, {});

export default getIncidencePeriods;

export function hasInvalidIncidence (features, eventDates) {
  const gridcodes = Object.keys(getIncidencePeriods(eventDates));

  return features.reduce((incidence, feature) => {
    const { properties } = feature;
    const { incidence: { GRIDCODE: gridcode = 0 } = {} } = properties;
    const incidenceInTime = gridcodes.reduce((total, period) =>
      Math.max(total, +(feature.properties[period] || 0)), 0);

    return Math.max(incidence, gridcode, incidenceInTime);
  }, 0) === 4;
}
