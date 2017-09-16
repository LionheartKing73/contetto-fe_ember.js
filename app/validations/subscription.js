import {
  validatePresence,
  validateFormat
} from 'ember-changeset-validations/validators';

export default {
  startDate: validatePresence({ presence: true, message: 'Start date is required' }),
  endDate: validatePresence({ presence: true, message: 'End date is required' }),
  plan: validatePresence({ presence: true, message: 'Plan is required' }),
  company: validatePresence({ presence: true, message: 'Company is required' }),
  card: validatePresence({ presence: true, message: 'Card is required' }),
};
