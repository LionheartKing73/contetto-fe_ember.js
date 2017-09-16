import {
  validatePresence,
} from 'ember-changeset-validations/validators';

export default {
  name: validatePresence({ presence: true, allowBlank: false, message: 'Channel name is required!' }),
  brand: validatePresence({ presence: true, message: 'Brand is required!' })
};
