/**
 * @returns {Array} Array of fields with error
 */
export const getFormErrors = formData =>
  Object.keys(formData).reduce((acc, fieldName) => {
    const fieldData = formData[fieldName];

    if (!fieldData.model) {
      return [...acc, ...getFormErrors(fieldData)];
    }

    if (!fieldData.valid) {
      return [...acc, fieldData.model];
    }

    return acc;
  }, []);

export default {
  getFormErrors,
};
