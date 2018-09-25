import moment from 'moment';

export const OFF_PATHS = 'hors_chemins';
export const PATHS = 'chemins';

export const firstOctober = moment('Oct 1 00:00:01', 'MMM DD hh:mm:ss');
export const thirtyOneMarch = moment('Mar 31 23:59:59', 'MMM DD hh:mm:ss');
export const firstApril = moment('Apr 1 00:00:01', 'MMM DD hh:mm:ss');
export const thirtyOneJuly = moment('Jul 31 23:59:59', 'MMM DD hh:mm:ss');
export const firstAugust = moment('Aug 1 00:00:01', 'MMM DD hh:mm:ss');
export const thirtyOneSeptember = moment('Sep 31 23:59:59', 'MMM DD hh:mm:ss');


/**
 * Get the incidence period
 * @param {Moment object} activityDate
 */
export const getIncidencePeriod = activityDate => {
  // activityDate >= 1er octobre && activityDate <= 31 mars
  if (moment(activityDate).isBetween(firstOctober, thirtyOneMarch)) {
    return 'GRIDCODE1'; // period : 1st october to 31th march
  }

  // activityDate >= 1er avril && activityDate <= 31 juillet
  if (moment(activityDate).isBetween(firstApril, thirtyOneJuly)) {
    return 'GRIDCODE2'; // period : 1st April to 31th July
  }

  // activityDate >= 1er août && activityDate <= 30 septembre
  // moment(activityDate).isBetween(firstAugust, thirtyOneSeptember);
  // Switch GRIDCODE to GRIDCODE3 when API is deployed.
  return 'GRIDCODE'; // period : 1st August to 31th September
};


export default PATHS;
