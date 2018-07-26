/**
 * hasPermissions returns true if all requested permissions are checked
 *
 * @param {array} userPermissions : current user permissions
 * @param {array} requestedPermissions : the permissions we wan't to check
 */
const hasPermissions = (userPermissions, requestedPermissions) => {
  const equal = requestedPermissions.filter(p1 => userPermissions.indexOf(p1) !== -1);
  return equal.length === requestedPermissions.length;
};

export default hasPermissions;
