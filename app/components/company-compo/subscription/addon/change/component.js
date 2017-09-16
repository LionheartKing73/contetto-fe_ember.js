import Ember from 'ember';
import SubscriptionAddon from '../../../../../utils/subscription-addon';
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
  store: inject.service(),
  init(){
    let subscriptionAddons = SubscriptionAddon.create({
      subscription: this.get('subscription'),
      addonTypes: this.get('store').peekAll('addonType'),
      editable: true
    });
    this.set('editableSubscriptionAddons', subscriptionAddons);
    this._super(...arguments);
  }
});
