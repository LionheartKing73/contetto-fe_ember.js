import Ember from 'ember';

export default Ember.Mixin.create({
  //The properties in this mixin shows the prices without applying coupons
  //proposed bills to be shown for future date
  //already billed items will be shown via invoices and line items

  //total plan bill when company is in regular period
  regularPlanBill: Ember.computed.alias('plan.price'),

  //total addon bill when company is in regular period
  regularAddonBill: Ember.computed('addonItems.@each.addonPrice', function(){
    return this.get('addonItems').reduce((previousValue, addonItem) => {
      if (!addonItem.get('endDate')) {
        return previousValue + addonItem.get('addon.price');
      }
      return previousValue;
    }, 0);
  }),

  //total bill when company is in regular period
  regularTotalBill: Ember.computed('regularPlanBill', 'regularAddonBill', function(){
    return this.get('regularPlanBill') + this.get('regularAddonBill');
  }),

  //proration factor that will be applied to plan. If yearly, it will be divided by 365/366. If monthly, then 28/29/30/31
  planProrationFactor: Ember.computed('plan', function(){
    if(this.get('plan.yearly')){
      return this.get('company.prorationDays')/this.get('company.prorationBillingYearDays');
    }
    return this.get('company.prorationDays')/this.get('company.prorationBillingMonthDays');
  }),

  //proration factor that will be applied to addon(always monthly). It will be divided by 28/29/30/31
  addonProrationFactor: Ember.computed(function(){
    return this.get('company.prorationDays')/this.get('company.prorationBillingMonthDays');
  }),

  //total plan bill when company is in proration period
  proratedPlanBill: Ember.computed('company.planProrationFactor', 'plan', function(){
    return (this.get('regularPlanBill')*this.get('planProrationFactor')).toFixed(2);
  }),

  //total addon bill when company is in proration period
  proratedAddonBill: Ember.computed('addonProrationFactor', 'plan', function(){
    return (this.get('regularAddonBill')*this.get('addonProrationFactor')).toFixed(2);
  }),

  //total bill when company is in proration period
  prorationTotalBill: Ember.computed('proratedPlanBill', 'proratedAddonBill', function(){
    return this.get('proratedPlanBill')+this.get('proratedAddonBill');
  }),

  //This tell whether there is any billing at all for the next month or not.
  nextMonthBilled: Ember.computed(function(){
    return this.get('willBillPlanNextMonth') || this.get('hasNextMonthAddonItems');
  }),

  //This return when the company will be billed next time. If there are addons or next month billable plan, then, first of next month, otherwise, next day of current plan end date.
  nextBillingDate: Ember.computed(function(){
    if(this.get('nextMonthBilled')){
      return moment().add(1, 'months').startOf('month').format('LL');
    }
    return this.get('nextPlanStartDate');
  }),

  //This returns plan amount to be paid on next billing date
  nextBillingDatePlanBill: Ember.computed(function(){
    let planPrice = 0;
    if(this.get('nextMonthPlanBill')){
      planPrice = this.get('nextMonthPlan.price');
    }
    return planPrice;
  }),

  //This returns addon amount to be paid on next billing date
  nextBillingDateAddonBill: Ember.computed(function(){
    this.get('totalAddonItemsPrice');
  }),


  //This returns total amount to be paid on next billing date
  nextBillingDateTotalBill: Ember.computed(function(){
    let planPrice = 0;
    if(this.get('nextMonthPlanBill')){
      planPrice = this.get('nextMonthPlan.price');
    }
    return planPrice + this.get('totalAddonItemsPrice');
  }),

  //This returns what will be the plan bill next month. If the plan is yearly and this is not the last month of the plan, then this returns null. If it is monthly, and there is no changed plan, then same plan regular price. If changed plan, then that plan's regular price.
  nextMonthPlanBill: Ember.computed(function(){
    if(this.get('willBillPlanNextMonth')){
      if(this.get('planChange')){
        return this.get('changedPlan.price');
      }
      return this.get('plan.price');
    }
  })
});
