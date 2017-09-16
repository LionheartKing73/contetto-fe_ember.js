import moment from 'moment';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default Model.extend({
  name: attr('string'),
  startDate: attr('utc-date', { defaultValue: moment.utc().startOf('day') }),
  endDate: attr('utc-date'),
  amount: attr('number'),

  brand: belongsTo('brand'),
  status: belongsTo('goal-status'),
  type: belongsTo('goal-type'),
  metric: belongsTo('goal-metric'),
  socialAccount: belongsTo('social-account')
});
