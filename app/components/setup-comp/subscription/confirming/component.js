import Ember from 'ember';

const {
  Component,
  set,
  get,
  inject,
  computed,
  isEmpty,
  RSVP
} = Ember;

export default Component.extend({
  actions: {
    saveSubscription() {
      this.set('subscription.type', this.get('subscription.plan.type'));
      this.set('subscription.planStartDate', this.get('company.billigStartDate'));
      this.get("subscription").save().then(subscription => {
        this.set("saving", false);
        get(this, 'toast').success('Subscribed successfully!', 'Success');
        this.transitionTo('setup.brand', get(subscription, 'company.id'));
      }).catch(() => set(this, 'saving', false));
    },
    save() {
      this.set("saving", true);
      this.send("saveSubscription");
    },
    back() {
      if (this.get('subscription.coupon.id')) {
        this.set('couponCode', this.get('selectedCouponCode'));
      } else {
        this.set("codeMessage", "");
      }
      this.set("isConfirming", false);
    }
  }
});
