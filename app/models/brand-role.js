import DS from 'ember-data';
import attr from 'ember-data/attr';
import {
  belongsTo
}
from 'ember-data/relationships';
import Ember from 'ember';

const {
  computed,
  get
} = Ember;

export default DS.Model.extend({
  name: attr('string'),
  managePosts: attr('to-boolean'),
  manageInbox: attr('to-boolean'),
  viewInbox: attr('to-boolean'),
  manageReviewStructure: attr('to-boolean'),
  manageSocialAccounts: attr('to-boolean'),
  manageTeam: attr('to-boolean'),
  overrideReviewStructure: attr('to-boolean'),
  viewAnalytics: attr('to-boolean'),
  doNotForceReview: attr('to-boolean'),


  brand: belongsTo('brand'),

  isEditable: attr('to-boolean'),
  isNotEditable: computed.not('isEditable')

});
