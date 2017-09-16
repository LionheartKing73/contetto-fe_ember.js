import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import {
  belongsTo,
  hasMany
}
from 'ember-data/relationships';

export default Model.extend({
  amount: attr('number'),
  formatAmount: Ember.computed('amount', function(){
    return this.get('amount');
  }),
  date: attr('utc-date'),
  formatDate: Ember.computed('date', function(){
    if(this.get('date'))
      return this.get('date').format('lll');
  }),
  description: attr('string'),
  card: belongsTo('card'),
  company: belongsTo('company'),
  invoice: belongsTo('invoice'),
  paymentStatus: belongsTo('paymentStatus')
});
