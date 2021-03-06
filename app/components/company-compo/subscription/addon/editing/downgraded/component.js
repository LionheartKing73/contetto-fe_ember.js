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
  toast: inject.service(),
  editAddon: inject.service(),
  init() {
    let subscriptionAddons = SubscriptionAddon.create({
      subscription: this.get('subscription'),
      groupedAddonItems: this.get('subscription.alreadyDowngradedAddons'),
      addonTypes: this.get('store').peekAll('addonType')
    });
    this.set('subscriptionAddons', subscriptionAddons);
    this._super(...arguments);
  },
  actions: {
    clearDowngradedAddons(){
      this.get('editAddon').clearDowngradedAddons(this.get('subscription')).then((addons) => {
        this.get('subscription').reload();
        this.get('toast').success('Downgraded Addons cleared successfully!');
      }).catch((addons) => {
        this.get('toast').error('Unable to update addons because of some error');
      });
    }
  }
});
