import {
  validatePresence,
  validateConfirmation
} from 'ember-changeset-validations/validators';

export default {
  password: validatePresence({ presence: true, message: 'Password is required!' }),
  confirmPassword: validateConfirmation({ on: 'password', message: 'Password and confirm password must be same!' })
};
