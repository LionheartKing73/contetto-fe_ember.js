import {
  validatePresence,
  validateFormat
} from 'ember-changeset-validations/validators';

export default {
  email: [
    validatePresence({ presence: true, message: 'Email is Required!' }),
    validateFormat({ allowBlank: true, type: 'email', message: 'Invalid Email!' })
  ]
};