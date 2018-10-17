import apiService from 'services/apiService';

/**
 * Upload file with fileType / endpoint and file.
 * @param {string} endpoint
 * @param {File object} file
 * @param {string} fileType
 */
export const upload = (endpoint, file, fileType = 'shapefile') => {
  const body = new FormData();
  body.append(fileType, file);
  return apiService.request(endpoint, {
    method: 'POST',
    body,
  });
};

export default upload;
