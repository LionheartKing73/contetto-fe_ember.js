import {
  validatePresence
} from 'ember-changeset-validations/validators';

export default {
  endDate: validatePresence({ presence: true, message: 'Due date is required!' }),
  amount: validatePresence({ presence: true, message: 'Amount is required!' }),
  type: validatePresence({ presence: true, message: 'Type of goal is required!' }),
  metric: validatePresence({ presence: true, message: 'Metric is required!' }),
  brand: validatePresence(true),
  status: validatePresence(true)
};