import {
  validatePresence
} from 'ember-changeset-validations/validators';

export default {
  name: validatePresence({ presence: true, message: 'Name is required!' }),
  brand: validatePresence({ presence: true, message: 'Brand is required!' })
};

