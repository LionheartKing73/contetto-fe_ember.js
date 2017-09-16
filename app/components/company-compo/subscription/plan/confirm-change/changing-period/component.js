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
  toast: inject.service(),
  planPayment: inject.service(),
  outstandingPlanPrice: computed(function() {
    return this.get('planPayment').outstandingPlanPrice(this.get('newPlan'), this.get('subscription'));
  }),
  planChange() {
    if (this.get('company.isTrial')) {
      this.set('subscription.plan', this.get('newPlan'));
    } else {
      this.set('subscription.nextDowngradedPlan', null);
      this.set('subscription.newPlan', this.get('newPlan'));
    }
    this.get('subscription').save().then((s) => {
      this.get('toast').success('Subscription updated successfully.');
      this.get('subscription').reload();
      this.set('confirmPlan', false);
    });
  },
  actions: {
    cancelConfirmPlan() {
      this.set('confirmPlan', false);
    },
    savePlanChange() {
      if (this.get('subscription.planChange')) {
        if (confirm(`You already changed your plan to ${this.get('subscription.changedPlan.name')}. Are you sure you want to cancel that change and go with this?`)) {
          this.planChange();
        }
      } else {
        this.planChange();
      }
    }
  }
});
