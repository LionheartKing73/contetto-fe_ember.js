import Ember from 'ember';
import SubscriptionAddons from '../utils/subscription-addon';
//This service aims to handle all the queries related to editing the addons. It checks the feasibility for the addons change. It upgrades addons, downgrades addons, removes downgraded addons.

export default Ember.Service.extend({
  toast: Ember.inject.service(),
  store: Ember.inject.service(),
  oldSubscriptionAddons(subscription) {
    return SubscriptionAddons.create({
      subscription
    }).get('addons');
  },
  upgradedAddons(subscription, newSubscriptionAddons) {
    let oldSubscriptionAddons = this.oldSubscriptionAddons(subscription);
    let arr = [];
    oldSubscriptionAddons.forEach((oldSubAddon) => {
      newSubscriptionAddons.forEach((newSubAddon) => {
        if (oldSubAddon.get('name') == newSubAddon.get('name')) {
          if (newSubAddon.get('newCount') > oldSubAddon.get('count')) {
            let hash = {
              name: oldSubAddon.get('name'),
              addonId: oldSubAddon.get('id'),
              unitPerks: newSubAddon.get('unitPerks'),
              unitPrice: newSubAddon.get('unitPrice'),
              diff: newSubAddon.get('newCount') - oldSubAddon.get('count'),
              perks: newSubAddon.get('perks'),
              price: newSubAddon.get('price'),
              perksDiff: newSubAddon.get('newPerks') - oldSubAddon.get('perks'),
              priceDiff: newSubAddon.get('newPrice') - oldSubAddon.get('price')
            };
            arr.push(hash);
          }
        }
      });
    });
    return arr;
  },
  downgradedAddonsPresent(subscription, newSubscriptionAddons) {
    return this.downgradedAddons(subscription, newSubscriptionAddons).length!=0;
  },
  upgradedAddonsPresent(subscription, newSubscriptionAddons) {
    return this.upgradedAddons(subscription, newSubscriptionAddons).length!=0;
  },
  downgradedAddons(subscription, newSubscriptionAddons) {
    let oldSubscriptionAddons = this.oldSubscriptionAddons(subscription);
    let arr = [];
    oldSubscriptionAddons.forEach((oldSubAddon) => {
      newSubscriptionAddons.forEach((newSubAddon) => {
        if (oldSubAddon.get('name') == newSubAddon.get('name')) {
          if (newSubAddon.get('newCount') < oldSubAddon.get('count')) {
            let hash = {
              name: oldSubAddon.get('name'),
              addonId: oldSubAddon.get('id'),
              unitPerks: newSubAddon.get('unitPerks'),
              unitPrice: newSubAddon.get('unitPrice'),
              diff: oldSubAddon.get('count') - newSubAddon.get('newCount'),
              perks: newSubAddon.get('perks'),
              price: newSubAddon.get('price'),
              perksDiff: oldSubAddon.get('perks') - newSubAddon.get('newPerks'),
              priceDiff: oldSubAddon.get('price') - newSubAddon.get('newPrice')
            };
            arr.push(hash);
          }
        }
      });
    });
    return arr;
  },
  downgradationPossibility(subscription, newSubscriptionAddons) {
    let brandsCheck = true,
      membersCheck = true,
      fileStorageCheck = true,
      postsCheck = true,
      accountsCheck = true;
    let downgradedAddons = this.downgradedAddons(subscription, newSubscriptionAddons);
    let company = subscription.get('company');
    downgradedAddons.forEach((addon) => {
      let diff = addon['diff'];
      if (addon.get('name') == "Brand") {
        brandsCheck = this.get('company.brandsLeft') >= diff;
      }
      if (addon.get('name') == "BrandMember") {
        membersCheck = this.get('company.teamMembersLeft') >= diff;
      }
      if (addon.get('name') == "Storage") {
        fileStorageCheck = this.get('company.fileStorageLeft') >= diff;
      }
      if (addon.get('name') == "Posts") {
        postsCheck = this.get('company.postingsLeft') >= diff;
      }
      if (addon.get('name') == "SocialAccount") {
        accountsCheck = this.get('company.socialAccountsLeft') >= diff;
      }
    });
    return brandsCheck && accountsCheck && postsCheck && fileStorageCheck && membersCheck;
  },
  clearDowngradedAddons(subscription) {
    var promiseArr = [];
    subscription.get('alreadyDowngradedAddonItems').forEach((addonItem) => {
      addonItem.set('endDate', null);
      promiseArr.push(addonItem.save());
    });
    return Promise.all(promiseArr);
  },
  addUpgradedAddons(subscription, upgradedAddons) {
    let addonItemsPromiseArr = [];
    upgradedAddons.forEach((addon) => {
      for (let i = 0; i < addon['diff']; i++) {
        var addonItem = this.get('store').createRecord('addonItem', {
          startDate: new Date(),
          addon: this.get('store').peekRecord('addon', addon['addonId']),
          subscription: subscription
        });
        addonItemsPromiseArr.push(addonItem.save());
      }
    });
    return Promise.all(addonItemsPromiseArr);
  },
  addDowngradedAddons(subscription, downgradedAddons) {
    let addonItemsPromiseArr = [];
    let lastDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59, 999);
    downgradedAddons.forEach((addon) => {
      let diff = addon['diff'];
      subscription.get('addonItems').filter((addonItem) => {
        return addonItem.get('addon.name') == addon.get('name');
      }).slice(0, diff).forEach((addonItem) => {
        if (this.get('company.isTrial')) {
          addonItemsPromiseArr.push(addonItem.destroyRecord());
        }
        else {
          addonItem.set('endDate', lastDate);
          addonItemsPromiseArr.push(addonItem.save());
        }
      });
    })
    return Promise.all(addonItemsPromiseArr);
  }
});
