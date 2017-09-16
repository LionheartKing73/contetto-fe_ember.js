import DS from "ember-data";
import Ember from "ember";

const {
  attr,
  belongsTo,
  hasMany
} = DS;

export default DS.Model.extend({
  brand: belongsTo('brand'),

  campaign: belongsTo('campaign'),
  title: attr('string'),
  topic: attr('string'),
  type: attr('string'),

  file: belongsTo('file'),
  networkType: belongsTo('networkType', {
    inverse: null
  }),

  content: attr('string'),
  createdAt: attr('string'),
  isApproved: attr('to-boolean'),
  isDraft: attr('to-boolean'),
  postedAt: attr('string'),
  published: attr('to-boolean'),
  reviewStatus: attr('to-boolean'),
  handleMax: attr('string'),
  tags: hasMany('tag'),
  postingSchedules: hasMany('postingSchedule'),
  postingStatus: belongsTo('postingStatus'),
  categories: hasMany('category'),
  changeRequests: hasMany('change-request'),
  user: belongsTo('user'),
  isPosted: attr('to-boolean'),
  chatRoom: belongsTo('chatRoom'),
  isBlog: attr('to-boolean'),
  wpTags: hasMany('wp-tag'),
  wpCategories: hasMany('wp-category'),
  snippets: hasMany('snippet'),
  parentId: attr('string'),
  externalId: attr('string'),
  dependencies: hasMany('postingSchedule'),
  url: attr('string'),

  isFollowup: attr('to-boolean'),
  followupTo: belongsTo('posting', {
    inverse: 'followups'
  }),
  followups: hasMany('posting'),
  pendingCR: Ember.computed('changeRequests.@each.status', function() {
    return this.get('changeRequests').filterBy('status.name', "Pending");
  })
});
