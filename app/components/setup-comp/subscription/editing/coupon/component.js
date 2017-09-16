import Ember from 'ember';

const {
  Component,
  set,
  get,
  inject,
  computed,
  isEmpty,
  RSVP,
  observer
} = Ember;

export default Component.extend({
  store: inject.service(),
  applyCoupon: inject.service(),
  couponEntered: computed('couponCode', function(){
    return !!this.get('couponCode');
  }),
  couponApplicableObs: observer('subscription.coupon.id', 'subscription.plan.id', function(){
    let couponApplicable;
    let couponApplyMessage;
    if(!this.get('subscription.plan.id')){
      couponApplicable = false;
      couponApplyMessage = "Please select a plan.";
    }
    else{
      couponApplicable = !this.get('subscription.coupon.id') || this.get('applyCoupon').couponApplicable(this.get('subscription'));
      couponApplyMessage = this.get('applyCoupon').couponApplyMessage(this.get('subscription'));
    }
    this.set('couponApplicable', couponApplicable);
    this.set('couponApplyMessage', couponApplyMessage);
  }),
  actions: {
    validCoupon(){
      let code = this.get('couponCode');
      this.get('store').queryRecord('coupon', {
        code: code
      }).then((coupon) => {
        this.set('selectedCouponCode', code);
        this.set('subscription.coupon', coupon);
        this.set('codeMessageClass', 'text-success');
        this.set('codeMessage', coupon.get('perks'));
      });
    },
    invalidCoupon(){
      this.set('subscription.coupon', undefined);
      this.set('selectedCouponCode', undefined);
      this.set('codeMessageClass', 'text-danger');
      this.set('codeMessage', "Invalid coupon entered. Please enter a valid coupon code");
    },
    validateCode(){
      let code = this.get('couponCode');
      this.get('applyCoupon').validate(code, this);
    },
    removeCoupon(){
      this.set('subscription.coupon', undefined);
      this.set('selectedCouponCode', undefined);
      this.set('codeMessage', undefined);
      this.set('couponCode', undefined);
    }
  }
});
