import Ember from 'ember';

//This mixin includes all the properties on susbcription that are related to plan.
export default Ember.Mixin.create({
  //This tells whether the plan that the subscription currently holds started on first of month or not.
  planStartedOnFirst: Ember.computed('planStartDate', function(){
    moment(this.get('planStartDate')).startOf('month').diff(this.get('planStartDate'))==0;
  }),
  //This tells the last date of validation of current plan i.e. upto which date current plan is billed.
  //If company is in proration period or plan is monthly, the company has already been billed for the current month.
  //If company is yearly, the company has already been billed for the year from start date.
  currentPlanEndDate: Ember.computed(function(){
    if(this.get('company.isProration') || this.get('plan.monthly')){
      return moment().endOf('month').format('LL');
    }
    if(this.get('plan.yearly')){
      return moment(this.get('planStartDate')).add(1, 'years').subtract(1, 'day').format('LL');
    }
  }),
  //This tells when the next plan will start
  nextPlanStartDate: Ember.computed(function(){
    return moment(this.get('currentPlanEndDate')).add(1, 'days').format('LL');
  }),
  //This tells upto which date is the current plan billed
  currentPlanBilledUpto: Ember.computed.alias('currentPlanEndDate'),
  //This tells when will the next plan be billed
  nextPlanBillingDate: Ember.computed.alias('nextPlanStartDate'),
  //This tells whether next month plan will be billed or not.
  willBillPlanNextMonth: Ember.computed(function(){
    return moment().add(1, 'month').startOf('month').isSame(moment(this.get('nextPlanBillingDate')));
  }),
  //This tells which plan is in use next month. If the plan is yearly and this is not the last month of the plan, then this returns null. If plan is yearly and will continue next month, same plan is returned. If plan is changed, then, changed plan is returned, otherwise same plan is returned
  nextMonthPlan: Ember.computed(function(){
    if(this.get('willBillPlanNextMonth') && this.get('planChange')){
      return this.get('changedPlan');
    }
    return this.get('plan');
  }),

  //This tells which is the next plan after the current plan. If there is not changed plan, then plan is the next plan.
  nextPlan: Ember.computed(function(){
    if(this.get('planChange')){
      return this.get('changedPlan');
    }
    return this.get('plan');
  }),

  //This tells whether the plan is billed on next billing date or not.
  nextBillingDatePlanBilled: Ember.computed(function(){
    return (!this.get('nextMonthBilled')) || (this.get('nextMonthBilled') && this.get('willBillPlanNextMonth'))
  })

});
