import { hasPermissions, canCommentInternal } from './permissionsHelpers';

describe('Permissions helpers', () => {
  describe('hasPermissions', () => {
    it('should returns true if a permission is in array', () => {
      const allPermissions = ['a', 'b', 'c', 'd'];
      const requestedPermissions = ['a'];

      expect(hasPermissions(allPermissions, requestedPermissions)).toBeTruthy();
    });

    it('should returns true if multiple permissions are in array', () => {
      const allPermissions = ['a', 'b', 'c', 'd'];
      const requestedPermissions = ['a', 'd', 'c'];

      expect(hasPermissions(allPermissions, requestedPermissions)).toBeTruthy();
    });

    it('should returns false no permission is in array', () => {
      const allPermissions = ['a', 'b', 'c', 'd'];
      const requestedPermissions = ['x'];

      expect(hasPermissions(allPermissions, requestedPermissions)).toBeFalsy();
    });

    it('should returns false no permission in multiple is in array', () => {
      const allPermissions = ['a', 'b', 'c', 'd'];
      const requestedPermissions = ['x', 'y', 'z'];

      expect(hasPermissions(allPermissions, requestedPermissions)).toBeFalsy();
    });
  });

  describe('canCommentInternal', () => {
    it('should returns true if only can_internal_comment_requests', () => {
      const allPermissions = ['trrequests.can_internal_comment_requests'];

      expect(canCommentInternal(allPermissions)).toBeTruthy();
    });

    it('should returns false if only c', () => {
      const allPermissions = ['trrequests.can_comment_requests'];

      expect(canCommentInternal(allPermissions)).toBeFalsy();
    });

    it('should returns false if both permissions and choose false', () => {
      const allPermissions = [
        'trrequests.can_internal_comment_requests',
        'trrequests.can_comment_requests',
      ];

      expect(canCommentInternal(allPermissions, false)).toBeFalsy();
    });

    it('should returns true if both permissions and choose true', () => {
      const allPermissions = [
        'trrequests.can_internal_comment_requests',
        'trrequests.can_comment_requests',
      ];

      expect(canCommentInternal(allPermissions, true)).toBeTruthy();
    });
  });
});
