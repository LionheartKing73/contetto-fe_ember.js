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
  addonPayment: inject.service(),
  editAddon: inject.service(),
  upgradedAddons: computed(function(){
    return this.get('editAddon').upgradedAddons(this.get('subscription'), this.get('editableSubscriptionAddons.addons'));
  }),
  totalDays: computed(function(){
    return this.get('addonPayment').monthDays();
  }),
  prorationDays: computed(function(){
    return this.get('addonPayment').prorationDays();
  }),
  outstandingAddonPrice: computed(function(){
    return this.get('addonPayment').outstandingAddonPrice(this.get('subscription'), this.get('upgradedAddons'));
  }),
  addonPrice: computed(function(){
    return this.get('addonPayment').addonPrice(this.get('subscription'), this.get('upgradedAddons'));
  }),
  discountOnAddonPrice: computed(function(){
    return this.get('addonPayment').discountOnAddonPrice(this.get('subscription'), this.get('upgradedAddons'));
  }),
  couponedAddonPrice: computed(function(){
    return this.get('addonPayment').couponedAddonPrice(this.get('subscription'), this.get('upgradedAddons'));
  })
});
