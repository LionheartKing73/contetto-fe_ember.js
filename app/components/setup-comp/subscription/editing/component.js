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
  //plans, locations, cards, subscription, cardChangeset
  isConfirming: false,
  saving: false,
  couponCode: "",
  selectedCouponCode: "",
  invalidChangeset: Ember.computed('subscription.plan', 'subscription.card', function(){
    return !this.get('subscription.card.id') || !this.get("subscription.plan.id");
  }),
  actions: {
    selectCard(card){
      this.set("subscription.card", card);
    },
    confirm() {
      if(!this.get('couponApplicable')){
        this.set('subscription.coupon', undefined);
      }
      var self = this;
      this.set('saving', true);
      Ember.run.next(this, function(){
        self.set('saving', false);
        self.set('isConfirming', true);
      });
    }
  }
});
