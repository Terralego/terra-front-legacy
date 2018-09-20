/**
 * removeEmptyObjectKeys
 * remove all keys with no values
 * @param {object} obj - the object to filter
 * @returns {object} - the filtered object
 */
const removeEmptyObjectKeys = obj => {
  Object.keys(obj).forEach(k => {
    if (obj[k] && typeof obj[k] === 'object') {
      removeEmptyObjectKeys(obj[k]);
    } else if (!obj[k] && obj[k] !== undefined) {
      delete obj[k]; // eslint-disable-line no-param-reassign
    }
  });
  return obj;
};

export default removeEmptyObjectKeys;
