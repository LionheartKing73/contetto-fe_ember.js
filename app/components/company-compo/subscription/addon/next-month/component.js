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
  init() {
    let subscriptionAddons = SubscriptionAddon.create({
      subscription: this.get('subscription'),
      groupedAddonItems: this.get('subscription.groupedAddonItems'),
      addonTypes: this.get('store').peekAll('addonType')
    });
    this.set('subscriptionAddons', subscriptionAddons);
    this._super(...arguments);
  }
});
