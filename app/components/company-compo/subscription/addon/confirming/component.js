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
  editAddon: inject.service(),
  addonPayment: inject.service(),
  downgradedAddons: Ember.computed(function(){
    return this.get('editAddon').downgradedAddons(this.get('subscription'), this.get('editableSubscriptionAddons.addons'));
  }),
  upgradedAddons: Ember.computed(function(){
    return this.get('editAddon').upgradedAddons(this.get('subscription'), this.get('editableSubscriptionAddons.addons'));
  }),
  downgradedAddonsPresent: computed(function(){
    return this.get('downgradedAddons').length!=0;
  }),
  upgradedAddonsPresent: computed(function(){
    return this.get('upgradedAddons').length!=0;
  }),
  actions: {
    cancelAddonModify(){
      this.set('confirmAddon', false);
      this.get('editableSubscriptionAddons').reset();
    },
    updateAddonItems(){
      let subscription = this.get('subscription');
      let upgradedAddons = this.get('upgradedAddons');
      let downgradedAddons = this.get('downgradedAddons');
      this.get('addonPayment').payAddonRecords(subscription, upgradedAddons).then(() => {
        let upgradePromise = this.get('editAddon').addUpgradedAddons(subscription, upgradedAddons);
        let downgradePromise = this.get('editAddon').addDowngradedAddons(subscription, downgradedAddons);
        Promise.all([upgradePromise, downgradePromise]).then(() => {
          subscription.reload();
          this.get('toast').success('Addons updated successfully!');
          this.send('cancelAddonModify');
        }).catch(() => {
          this.get('toast').error('Unable to update addons because of some error');
        });
      })
    }
  }
});
