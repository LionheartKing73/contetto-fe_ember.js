import Ember from 'ember';
import DS from 'ember-data';
import attr from 'ember-data/attr';
import {
  belongsTo,
  hasMany
}
from 'ember-data/relationships';

export default DS.Model.extend({
  title: attr('string'),
  platform: attr('string'),
  token: attr('string'),
  tokenSecret: attr('string'),
  pageId: attr('string'),
  pageTitle: attr('string'),
  startTime: attr('date'),
  endTime: attr('date'),
  brand: belongsTo('brand'),
  postings: belongsTo('posting'),
  accountSchedules: hasMany('accountSchedule'),
  marketingChannel: belongsTo('reviewChannel'),
  engagementChannel: belongsTo('reviewChannel'),
  readyOffset: attr('number'),
  marketingPostScheduleMode: belongsTo('postingScheduleMode'),
  engagementPostScheduleMode: belongsTo('postingScheduleMode'),
  tokenValid: attr('to-boolean'),

  externalURL: attr('string'),
  wpTags: hasMany('wp-tag'),
  wpCategories: hasMany('wp-category'),
  foundSocialReviewChannel: Ember.computed('marketingChannel', 'engagementChannel', function() {
    return (this.get('marketingChannel.id') != null || this.get('engagementChannel.id') != null);
  })
});
