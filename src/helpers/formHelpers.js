/**
 * @returns {Array} Array of fields with error
 */
export const getFormErrors = formData =>
  Object.keys(formData).reduce((acc, fieldName) => {
    const fieldData = formData[fieldName];

    if (fieldData.$form) {
      return [...acc, ...getFormErrors(fieldData)];
    }

    if (!fieldData.valid && fieldData.model) {
      return [...acc, fieldData.model];
    }

    return acc;
  }, []);

export default {
  getFormErrors,
};
