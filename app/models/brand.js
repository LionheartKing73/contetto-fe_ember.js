import DS from "ember-data";
import Ember from "ember";
import attr from 'ember-data/attr';
import {
  belongsTo,
  hasMany
}
from 'ember-data/relationships';

export default DS.Model.extend({
  description: attr('string'),
  address: attr('string'),
  city: attr('string'),
  name: attr('string'),
  phone: attr('string'),
  postal: attr('string'),
  companyId: attr('string'),
  logo: attr('string'),
  timezone: attr('string'),
  brandRoles: hasMany('brandRole'),
  brandMembers: hasMany('brandMember'),
  socialAccounts: hasMany('socialAccounts'),
  wordpressAccounts: Ember.computed("socialAccounts.@each.id", function(){
    return this.get("socialAccounts").filter((socialAccount) => {
      return socialAccount.get("platform") == "wordpress";
    });
  }),
  nonWordPressAccounts: Ember.computed("socialAccounts.@each.id", function(){
    return this.get("socialAccounts").filter((socialAccount) => {
      return socialAccount.get("platform") != "wordpress";
    });
  }),
  campaigns: hasMany('campaign'),
  categories: hasMany('category'),
  targetAudiences: hasMany('audience'),
  productGroups: hasMany('audience'),

  company: belongsTo('company'),
  defaultTargetAudience: belongsTo('audience'),
  vertical: belongsTo('vertical'),
  country: belongsTo('location'),
  state: belongsTo('location'),
  contentManager: belongsTo('user'),
  departments: hasMany('department'),
  tags: hasMany('tag'),
  reviewChannels: hasMany('reviewChannel'),
  chatRooms: hasMany('chatRoom'),
  allDepartmentsLed: Ember.computed('departments.@each.manager', function() {
    var dCount = this.get('departments.length');
    var mCount = 0;
    this.get("departments").forEach(function(department) {
      mCount += department.get('manager.id') != null;
    });
    return mCount === dCount;
  }),
  foundSocialReviewChannel: Ember.computed('socialAccounts.@each.foundSocialReviewChannel', function() {
    return !!this.get('socialAccounts').filter((socialAccount) => socialAccount.get('foundSocialReviewChannel')).length;
  })

});
