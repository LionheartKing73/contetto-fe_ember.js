import Ember from 'ember';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import {
  belongsTo,
  hasMany
}
from 'ember-data/relationships';

export default Model.extend({
  date: attr('utc-date'),
  formatDate: Ember.computed('date', function(){
    if(this.get('date'))
      return this.get('date').format('lll');
  }),
  invoiceStatus: belongsTo('invoiceStatus'),
  company: belongsTo('company', {
    inverse: 'invoices'
  }),
  lineItems: hasMany('lineItem'),
  payments: hasMany('payment'),
  successfull: Ember.computed('invoiceStatus.name', function(){
    return this.get('invoiceStatus.name')=="Paid";
  }),
  failed: Ember.computed.not('successfull'),
  amount: Ember.computed('lineItems.@each.cost', function(){
    var amount = 0;
    this.get('lineItems').forEach((lineItem) => {
      amount += lineItem.get('cost');
    });
    return amount;
  })
});
