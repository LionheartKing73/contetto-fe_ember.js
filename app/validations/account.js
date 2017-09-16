import {
  validatePresence,
  validateNumber
} from 'ember-changeset-validations/validators';

export default {
  title: validatePresence({ presence: true, message: 'Title is required!' }),
  readyOffset: [
    validatePresence({ presence: true, message: 'Not ready alert is required!' }),
    validateNumber({ positive: true, integer: true, message: 'Not ready alert should be a positive number' }),
  ]
};
