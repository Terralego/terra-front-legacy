export function getUsers (state) {
  return state.users.list.map(uuid => state.users[uuid]);
}

export function getUser (state) {
  return id => state.users[id];
}

export default null;
