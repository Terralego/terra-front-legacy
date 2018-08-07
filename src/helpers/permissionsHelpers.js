/**
 * hasPermissions returns true if all requested permissions are checked
 *
 * @param {array} userPermissions : current user permissions
 * @param {array} requestedPermissions : the permissions we wan't to check
 */
export const hasPermissions = (userPermissions, requestedPermissions) =>
  userPermissions.includes(...requestedPermissions);

/**
 * canCommentInternal
 * returns true if user must comment internal only
 * returns false if user must comment publicly only
 * returns choosen value if user can comment internal and publicly
 *
 * @param {array} permissions : current user permissions
 * @param {boolean} defaultValue : value choosen by user
 */
export const canCommentInternal = (permissions, defaultValue = true) => {
  // N1
  if (
    hasPermissions(permissions, ['trrequests.can_internal_comment_requests'])
    && !hasPermissions(permissions, ['trrequests.can_comment_requests'])
  ) {
    return true;
  }

  // User
  if (
    !hasPermissions(permissions, ['trrequests.can_internal_comment_requests'])
    && hasPermissions(permissions, ['trrequests.can_comment_requests'])
  ) {
    return false;
  }

  // N2
  return defaultValue;
};
