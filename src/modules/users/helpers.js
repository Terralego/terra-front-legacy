import apiService, { defaultHeaders } from 'services/apiService';
import queryString from 'query-string';

/**
 * Search users
 * @params {String} search Query to search
 * @params { String[] } inGroups List of groups in users should be. Group name wan take a "!" prefix to exclude
 * @params { String } uuid search in uuid
 * @exemple
 * searchUsers({ email: 'a', inGroups: ['!a', 'b']})
 */
export const searchUsers = async ({ search, inGroups, uuid }) => {
  const query = {};

  if (search) {
    query.search = search;
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

  if (uuid) {
    query.uuid = uuid;
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
