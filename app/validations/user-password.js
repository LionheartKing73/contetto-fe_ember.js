import {
  validatePresence,
  validateConfirmation
} from 'ember-changeset-validations/validators';

export default {
  oldPassword: validatePresence({ presence: true, message: 'Old password is required' }),
  newPassword: validatePresence({ presence: true, message: 'New password is required' }),
  cnfPassword: validateConfirmation({ allowBlank: true, on: 'newPassword', message: 'New password and password confirm must match' }),
};