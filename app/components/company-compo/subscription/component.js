import Ember from 'ember';
import cardValidations from 'contetto/validations/card';

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
  toast: Ember.inject.service(),
  subscriptionEndDate: computed('subscriptionChangeset.startDate', function(){
    var startDate = moment(this.get('subscriptionChangeset.startDate'));
    return startDate.add(30, 'days').format('LL');
  }),
  billingStartDate: computed('subscriptionChangeset.startDate', function(){
    var startDate = moment(this.get('subscriptionChangeset.startDate'));
    return startDate.add(31, 'days').format('LL');
  }),
  actions: {
    refreshTabs(tab){
      if(tab!='plan'){
        this.get('confirmPlan', false);
        this.get('subscriptionChangeset').rollback();
      }
      if(tab!='addon'){
        this.toggleProperty('resetAddons');
        this.set('confirmAddon', false);
      }
    },
    cancelTrial(){
      if(confirm("Are you sure, you want to cancel the trial?")){
        this.get('company').save().then((company) => {
          this.set('company.cancelledSubscription', true);
          this.get('toast').success('Trial Cancelled Successfully');
        });
      }
    },
    undoCancellation(){
      if(confirm("Are you sure, you want to undo the cancellation?")){
        this.get('company').save().then((company) => {
          this.set('company.cancelledSubscription', false);
          this.get('toast').success('Trial Cancellation Reverted Successfully');
        });
      }
    }
  }
});
