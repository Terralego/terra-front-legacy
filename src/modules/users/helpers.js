import apiService, { defaultHeaders } from 'services/apiService';
import queryString from 'query-string';

export const searchUsers = async ({ email, inGroups, properties }) => {
  const query = {};

  if (email) {
    query.email = email;
  }

  if (inGroups) {
    const groupsIn = inGroups.filter(group => group.match(/^[^!]/));
    if (groupsIn.length) {
      query.groups__in = groupsIn;
    }
    const groupsNotin = inGroups
      .filter(group => group.match(/^!/))
      .map(group => group.replace(/^!/, ''));
    if (groupsNotin.length) {
      query.groups__notin = groupsNotin;
    }
  }

  if (properties) {
    Array.from(Object.keys(properties)).forEach(k => {
      query[`properties__${k}`] = properties[k];
    });
  }

  try {
    const endpoint = `/user/?${queryString.stringify(query)}`;
    const { data: { results } } = await apiService.request(endpoint, {
      headers: defaultHeaders,
    });
    return results;
  } catch (error) {
    return [];
  }
};

export default searchUsers;
