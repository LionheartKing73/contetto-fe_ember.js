import {
  validatePresence
} from 'ember-changeset-validations/validators';

export default {
  title: validatePresence({ presence: true, message: 'Title is required!' }),
  brand: validatePresence({ presence: true, message: 'Brand is required!' })
};
