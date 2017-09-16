import Ember from 'ember';
import DS from 'ember-data';
import attr from 'ember-data/attr';
import {
  belongsTo,
  hasMany
}
from 'ember-data/relationships';

const {
  computed,
  get,
  isEmpty
} = Ember;

export default DS.Model.extend({
  subject: attr('string'),
  content: attr('string'),
  assignedToUser: belongsTo('user', {
    inverse: null
  }),
  status: belongsTo('changeRequestStatus'),
  requestBy: belongsTo('user', {
    inverse: null
  }),
  requestTime: attr('utc-date'),
  posting: belongsTo('posting', {
    async: false
  }),
  requestDue: attr('utc-date'),
  files: hasMany("file"),
  channelStep: belongsTo("channelStep"),
  brand: belongsTo('brand')

});
