import {
  validatePresence
} from 'ember-changeset-validations/validators';

export default {
  user: validatePresence({ presence: true, message: 'User is required' }),
};
