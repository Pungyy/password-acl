import { AccessControl } from 'accesscontrol';

const ac = new AccessControl();

// Permissions hiérarchiques
ac.grant('guest')
  .readOwn('profile');

ac.grant('user')
  .extend('guest')
  .createOwn('data')
  .updateOwn('data')
  .deleteOwn('data');

ac.grant('admin')
  .extend('user')
  .readAny('profile')
  .createAny('data')
  .updateAny('data')
  .deleteAny('data');

export { ac };
