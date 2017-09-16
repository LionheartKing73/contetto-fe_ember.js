import Ember from 'ember';

export default Ember.Mixin.create({
  startDate: Ember.computed('subscription.startDate', function() {
    let startDate = moment();
    if (this.get('subscription.id')) {
      startDate = this.get('subscription.startDate');
    }
    return startDate;
  }),

  formatStartDate: Ember.computed('startDate', function() {
    let startDate = this.get('startDate');
    return moment(startDate).format('LL');
  }),

  trialEndDate: Ember.computed('startDate', function(){
    let startDate = this.get('startDate');
    return moment(startDate).add(30, 'days').format('LL');
  }),

  billingStartDate: Ember.computed('startDate', function(){
    let startDate = this.get('startDate');
    return moment(startDate).add(31, 'days').format('LL');
  }),

  prorationBillingMonth: Ember.computed('startDate', function(){
    let startDate = this.get('startDate');
    return moment(startDate).add(31, 'days').format('MMMM');
  }),

  prorationBillingMonthDays: Ember.computed('startDate', function(){
    let startDate = this.get('startDate');
    return moment(startDate).add(31, 'days').daysInMonth();
  }),

  prorationBillingYearDays: Ember.computed('startDate', function(){
    let startDate = this.get('startDate');
    if(moment(startDate).isLeapYear()){
      return 366;
    }
    else{
      return 365;
    }
  }),
  prorationBillingTotalDays: Ember.computed('subscription.plan', function(){
    if(this.get('subscription.plan.monthly')){
      return this.get('prorationBillingMonthDays');
    }
    return this.get('prorationBillingYearDays');
  }),
  prorationDays: Ember.computed('trialEndDate', function(){
    let trialEndDate = this.get('trialEndDate');
    let eom = moment(trialEndDate).endOf('month');
    let diff = eom.diff(trialEndDate, 'days');
    return diff;
  }),

  oneProrationDay: Ember.computed('prorationDays', function(){
    return this.get('prorationDays')==1;
  }),

  regularBillingStartDate: Ember.computed('startDate', function(){
    let startDate = this.get('startDate');
    return moment(startDate).add(31, 'days').add(1, 'months').startOf('month').format('LL');
  }),

  totalBillingMonthsElapsed: Ember.computed('billingStartDate', function(){
    if(this.get('billingStartDate')>moment()){
      return 0;
    }
    return moment().startOf('month').diff(this.get('billingStartDate').startOf('month'), 'months') + 1;
  })
});
