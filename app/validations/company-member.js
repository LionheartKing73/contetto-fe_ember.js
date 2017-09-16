import {
  validatePresence,
  validateFormat
} from 'ember-changeset-validations/validators';

export default {
  email: [
    validatePresence({ presence: true, message: 'Email is required' }),
    validateFormat({ allowBlank: true, type: 'email' })
  ],
  companyRole: validatePresence({ presence: true, message: 'Role is required' }),
};