import {
  validatePresence,
  validateNumber
} from 'ember-changeset-validations/validators';

export default {
  name: validatePresence({ presence: true, message: 'Step name is required!' }),
  department: validatePresence({ presence: true, message: 'Department is required!' }),
  order: [
    validatePresence({ presence: true, message: 'Step Order is required!' }),
    validateNumber({ integer: true })
  ]
};

