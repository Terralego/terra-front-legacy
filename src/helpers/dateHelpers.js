import moment from 'moment';

export const RECURRENCE_NONE = 'none';
export const RECURRENCE_DAYS = 'days';
export const RECURRENCE_WEEKS = 'weeks';
export const RECURRENCE_MONTHS = 'months';

export const optionsRecurrence = [
  {
    label: 'une seule fois',
    value: RECURRENCE_NONE,
  },
  {
    label: 'jours',
    value: RECURRENCE_DAYS,
  },
  {
    label: 'semaines',
    value: RECURRENCE_WEEKS,
  },
  {
    label: 'mois',
    value: RECURRENCE_MONTHS,
  },
];

/**
 * Return true/false when the date is before endDate
 *
 * @param {[object|string]} date - date to test
 * @param {[object|string]} endDate
 * @returns {boolean}
 */
export const isEndDateAfter = (date, endDate) => {
  if (!date || !endDate) return false;
  return moment(date).isBefore(endDate);
};


/**
 * Get all dates day by day between a range of date
 * @param  {object} model to calcul the range
 * @returns {array} list of collection containing `startDate` and `endDate` properties
 */
export const getDatesDuplicated = date => {
  const {
    startDate,
    endDate,
    type,
    frequency,
    limitDate,
  } = date;

  if (type === RECURRENCE_NONE) {
    return {
      dates: [{
        startDate,
        endDate,
      }],
      recurrence: { type, frequency, limitDate },
    };
  }

  const totalDates =
    Math.round((
      (moment(limitDate).diff(startDate, type, true)
      ) + 1) / frequency);

  return {
    dates: [
      ...Array.from({ length: totalDates }, (_, i) => (
        {
          startDate: moment(startDate).add(i * +frequency, type),
          endDate: moment(endDate).add(i * +frequency, type),
        }
      )),
    ],
    recurrence: { type, frequency, limitDate },
  };
};

