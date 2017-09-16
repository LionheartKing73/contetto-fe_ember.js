import {
  validatePresence
} from 'ember-changeset-validations/validators';

export default {
  name: validatePresence({ presence: true, message: 'Role Name is required' })
};