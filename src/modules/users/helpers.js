import apiService, { defaultHeaders } from 'services/apiService';

const GROUPS_IN = 'groups__in';
const GROUPS_NOT_IN = 'groups__notin';

/**
 * Search users
 * @params {String} search Query to search
 * @params { String[] } inGroups List of groups in users should be.
 * Group name can take an "!" prefix to exclude
 * @params { String } uuid search in uuid
 * @exemple
 * searchUsers({ email: 'a', inGroups: ['!a', 'b']})
 */
export const searchUsers = async ({ search, inGroups, uuid }) => {
  const query = [];

  if (search) {
    query.push(`search=${encodeURIComponent(search)}`);
  }

  if (inGroups) {
    const filtered = inGroups.reduce((list, group) => {
      const target = group[0] === '!'
        ? GROUPS_NOT_IN
        : GROUPS_IN;

      return {
        ...list,
        [target]: [...list[target], group.replace(/^!/, '')],
      };
    }, { [GROUPS_IN]: [], [GROUPS_NOT_IN]: [] });

    Object.keys(filtered).forEach(key => {
      const list = filtered[key];
      if (list.length) {
        query.push(`groups__name${key === GROUPS_NOT_IN ? '!' : ''}=${list.join(',')}`);
      }
    });
  }

  if (uuid) {
    query.push(`uuid=${uuid}`);
  }

  try {
    const endpoint = `/user/?${query.join('&')}`;
    const { data: { results } } = await apiService.request(endpoint, {
      headers: defaultHeaders,
    });
    return results;
  } catch (error) {
    return [];
  }
};

export default searchUsers;
