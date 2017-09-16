import Ember from 'ember';

const {
  Component,
  get,
  set,
  isEmpty,
  inject,
  computed,
  RSVP,
  observer
} = Ember;

export default Component.extend({
  monthlyInvoices: Ember.computed('invoices.@each.successfull', 'invoices.@each.date', function(){
    return this.get('invoices').filter((invoice) => {
      return invoice.get('date') && invoice.get('date').month()==new Date().getMonth() && invoice.get('successfull');
    });
  }),
  monthlyCosts: Ember.computed('monthlyInvoices.@each.amount', function(){
    return this.get('monthlyInvoices').reduce((previousValue, invoice) => {
      return previousValue + parseFloat(invoice.get('amount'));
    }, 0);
  }),
  planInvoices: Ember.computed('monthlyInvoices.@each.id', function(){
    return this.get('monthlyInvoices').filter((invoice) => {
      return invoice.get('lineItems').filter((lineItem) => {
        return lineItem.get('itemType')=='plan';
      }).length!=0;
    }).sortBy('date');
  }),
  addonInvoices: Ember.computed('monthlyInvoices.@each.id', function(){
    return this.get('monthlyInvoices').filter((invoice) => {
      return invoice.get('lineItems').filter((lineItem) => {
        return lineItem.get('itemType')=='addon';
      }).length!=0;
    }).sortBy('date');
  }),
});
