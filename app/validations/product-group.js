import {
  validatePresence
} from 'ember-changeset-validations/validators';

export default {
  name: validatePresence({ presence: true, message: 'Name is required!' }),
  description: validatePresence({ presence: true, message: 'Description is required!' })
};
