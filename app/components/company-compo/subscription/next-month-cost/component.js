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
  planCosting: computed('subscription.plan.price', 'subscription.firstBillingMonthDays',  'subscription.prorationDays', function(){
    var val = this.get('subscription.plan.price') * this.get('subscription.prorationDays') / this.get('subscription.firstBillingMonthDays');
    return val;
  }),
  addonCosting: computed('subscription.groupedAddonItems', 'subscription.firstBillingMonthDays',  'subscription.prorationDays', function(){
    var groupedAddonItems = this.get('subscription.groupedAddonItems');
    var hash = {}
    for(var k in groupedAddonItems){
      hash[k] = groupedAddonItems[k] * this.get('subscription.prorationDays') / this.get('subscription.firstBillingMonthDays');
    }
    return hash;
  })
});
