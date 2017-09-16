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
  couponedOutstandingPlanPrice: computed(function() {
    return this.get('planPayment').couponedOutstandingPlanPrice(this.get('newPlan'), this.get('subscription'));
  }),
  discountOnOutstandingPlanPrice: computed(function() {
    return this.get('planPayment').discountOnOutstandingPlanPrice(this.get('newPlan'), this.get('subscription'));
  }),
  planDowngrade() {
    if (this.get('company.isTrial')) {
      this.set('subscription.plan', this.get('newPlan'));
    } else {
      this.set('subscription.newPlan', null);
      this.set('subscription.nextDowngradedPlan', this.get('newPlan'));
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
    saveDowngradedPlan() {
      if (this.get('subscription.planChange')) {
        if (confirm(`You already changed your plan to ${this.get('subscription.changedPlan.name')}. Are you sure you want to cancel that change and go with this?`)) {
          this.planDowngrade();
        }
      } else {
        this.planDowngrade();
      }
    }
  }
});
