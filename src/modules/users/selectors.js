export function getUsers (state) {
  return state.users.list.map(uuid => state.users[uuid]);
}

export default null;
