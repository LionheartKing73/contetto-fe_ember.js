import {
  validatePresence
} from 'ember-changeset-validations/validators';

export default {
  name: validatePresence({ presence: true, message: 'Role name is required!' }),
  brand: validatePresence({ presence: true, message: 'Brand is required!' })
};
