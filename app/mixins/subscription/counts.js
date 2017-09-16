import Ember from 'ember';

export default Ember.Mixin.create({
  totalAddonBrands: Ember.computed('addonItems.@each.addonAmount', function() {
    return this.get('addonItems').filter((item) => {
      return item.get('name') == "Brand";
    }).reduce((previousValue, item) => {
      return previousValue + item.get('addon.amount');
    }, 0);
  }),
  totalAddonSocialAccounts: Ember.computed('addonItems.@each.addonAmount', function() {
    return this.get('addonItems').filter((item) => {
      return item.get('name') == "SocialAccount";
    }).reduce((previousValue, item) => {
      return previousValue + item.get('addon.amount');
    }, 0);
  }),
  totalAddonBrandMembers: Ember.computed('addonItems.@each.addonAmount', function() {
    return this.get('addonItems').filter((item) => {
      return item.get('name') == "BrandMember";
    }).reduce((previousValue, item) => {
      return previousValue + item.get('addon.amount');
    }, 0);
  }),
  totalAddonPosts: Ember.computed('addonItems.@each.addonAmount', function() {
    return this.get('addonItems').filter((item) => {
      return item.get('name') == "Posts";
    }).reduce((previousValue, item) => {
      return previousValue + item.get('addon.amount');
    }, 0);
  }),
  totalAddonStorage: Ember.computed('addonItems.@each.addonAmount', function() {
    return this.get('addonItems').filter((item) => {
      return item.get('name') == "Storage";
    }).reduce((previousValue, item) => {
      return previousValue + item.get('addon.amount');
    }, 0);
  }),
  
  totalBrands: Ember.computed('plan.brandsCount', 'totalAddonBrands', function() {
    return this.get('plan.brandsCount') + this.get('totalAddonBrands');
  }),
  totalSocialAccounts: Ember.computed('plan.socialAccountsCount', 'totalAddonSocialAccounts', function() {
    return this.get('plan.socialAccountsCount') + this.get('totalAddonSocialAccounts');
  }),
  totalBrandMembers: Ember.computed('plan.teamMembersCount', 'totalAddonBrandMembers', function() {
    return this.get('plan.teamMembersCount') + this.get('totalAddonBrandMembers');
  }),
  totalPosts: Ember.computed('plan.postsCount', 'totalAddonPosts', function() {
    return this.get('plan.postsCount') + this.get('totalAddonPosts');
  }),
  totalStorage: Ember.computed('plan.storageSize', 'totalAddonStorage', function() {
    return this.get("plan.storageSize") + this.get('totalAddonStorage');
  })
});
