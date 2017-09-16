import Ember from 'ember';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import {
  belongsTo,
  hasMany
}
from 'ember-data/relationships';

export default Model.extend({
  amountOff: attr('number'),
  percentOff: attr('number'),
  timesUsage: attr('number'),
  startDate: attr('utc-date'),
  endDate: attr('utc-date'),
  code: attr('number'),
  months: attr('number'),
  years: attr('number'),
  plan: belongsTo('plan'),
  subscription: belongsTo('subscription'),
  monthlyCoupon: Ember.computed('months', function(){
    return this.get('months') && this.get('months')!=-1;
  }),
  yearlyCoupon: Ember.computed('years', function(){
    return this.get('years') && this.get('years')!=-1;
  }),
  lifelongCoupon: Ember.computed('monthlyCoupon', 'yearlyCoupon', function(){
    return !(this.get('monthlyCoupon') || this.get('yearlyCoupon'));
  }),
  monthsUsed: Ember.computed.alias('subscription.totalBillingMonthsElapsed'),
  monthsLeft: Ember.computed('monthsProvided', 'monthsUsed', function(){
    return this.get('monthsProvided')-this.get('monthsUsed');
  }),
  monthsProvided: Ember.computed(function(){
    if(this.get('monthlyCoupon')){
      return this.get('months');
    }
    if(this.get('yearlyCoupon')){
      return this.get('years')*12;
    }
    if(this.get('lifelongCoupon')){
      return 100;
    }
  }),
  lastCouponDate: Ember.computed('monthsProvided', 'subscription', function(){
    if(this.get('lifelongCoupon')){
      return moment('2100-01-01');
    }
    return moment(this.get('subscription.billingStartDate')).add(this.get('monthsProvided')-1, 'months').endOf('month');
  }),
  nextMonthAvailable: Ember.computed('monthsLeft', function(){
    return this.get('monthsLeft')>0;
  }),
  currentMonthApplied: Ember.computed('monthsUsed', 'monthsProvided', function(){
    return this.get('monthsProvided')>=this.get('monthsUsed');
  }),

  perks: Ember.computed('plan', 'months', 'amountOff', 'percentOff', function(){
    let message = "";
    if(this.get('amountOff')){
      message+=this.get('amountOff') + "$ discount will be applied";
    }
    if(this.get('percentOff')){
      message+=this.get('percentOff') + "% discount will be applied";
    }
    if(this.get('subscription.company.prorotationDays') < 1){
        message += " on the ";
    }
    if(this.get('planType')){
      message+=this.get('plan.name') + " plan"
    }
    if(this.get('subscription.company.prorationDays') > 0){
      message+= " for prorated period";
    }
    if(this.get('billType') && this.get('subscription.company.prorationDays') < 1){
      message+="total bill"
    }
    if(this.get('monthlyCoupon') && this.get('subscription.company.prorationDays') < 1){
      message+= " for " + this.get('months') + " months"
    }
    if(this.get('lifelongCoupon')){
      message+= " lifelong."
    }
    return message;
  }),
  offer: Ember.computed('plan', 'amountOff', 'percentOff', function(){
    let message = "";
    if(this.get('amountOff')){
      message+=this.get('amountOff') + "$ discount will be applied on the ";
    }
    if(this.get('percentOff')){
      message+=this.get('percentOff') + "% discount will be applied on the ";
    }
    if(this.get('planType')){
      message+=this.get('plan.name') + " plan"
    }
    if(this.get('billType')){
      message+="total bill"
    }
    return message;
  }),
  planType: Ember.computed('plan.id', function(){
    return !!this.get('plan.id');
  }),
  billType: Ember.computed.not('planType'),
  amountType: Ember.computed('amountOff', function(){
    return !!this.get('amountOff');
  }),
  percentType: Ember.computed('percentOff', function(){
    return !!this.get('percentOff');
  })
});
