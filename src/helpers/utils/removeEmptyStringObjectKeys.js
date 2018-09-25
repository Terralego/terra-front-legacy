/**
 * removeEmptyStringObjectKeys
 * remove all items containing empty string values
 * @param {object} obj - the object to filter
 * @returns {object} - the filtered object
 */
const removeEmptyStringObjectKeys = obj => Object.keys(obj).reduce(
  (acc, key) => {
    if (Object.prototype.toString.call(obj[key]) === '[object Object]') {
      return {
        ...acc,
        [key]: removeEmptyStringObjectKeys(obj[key]),
      };
    }

    if (obj[key] !== '') {
      return {
        ...acc,
        [key]: obj[key],
      };
    }

    return acc;
  },
  {},
);

export default removeEmptyStringObjectKeys;
