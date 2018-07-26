import hasPermissions from './permissionsHelpers';

describe('Permissions helpers', () => {
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
