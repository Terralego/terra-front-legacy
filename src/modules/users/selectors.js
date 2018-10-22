export function getUsers (state) {
  /**
   * Get all users from list
   */
  return state.users.list.map(uuid => state.users[uuid]);
}

export function getUser (state) {
  /**
   * Get a user from its ID
   * @params {String} id User id
   */
  return id => state.users[id];
}

export default null;
