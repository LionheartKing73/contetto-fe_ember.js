import Ember from 'ember';

export default Ember.Mixin.create({
  brandsLeft: Ember.computed('subscription.totalBrands', 'brandsUsage', function(){
    return this.get("subscription.totalBrands")-this.get("brandsUsage") || 0;
  }),
  fileStorageLeft: Ember.computed('subscription.totalStorage', 'fileStorageUsage', function(){
    return this.get("subscription.totalStorage")-this.get("fileStorageUsage") || 0;
  }),
  postingsLeft: Ember.computed('subscription.totalPosts', 'postingsUsage', function(){
    return this.get("subscription.totalPosts")-this.get("postingsUsage") || 0;
  }),
  socialAccountsLeft: Ember.computed('subscription.totalSocialAccounts', 'socialAccountsUsage', function(){
    return this.get("subscription.totalSocialAccounts")-this.get("socialAccountsUsage") || 0;
  }),
  teamMembersLeft: Ember.computed('subscription.totalBrandMembers', 'teamMembersUsage', function(){
    return this.get("subscription.totalBrandMembers")-this.get("teamMembersUsage") || 0;
  })
});
