import DS from 'ember-data';
import attr from 'ember-data/attr';
import {
  belongsTo,
  hasMany
}
from 'ember-data/relationships';

const {
  computed,
  get
} = Ember;

export default DS.Model.extend({
  name: attr('string'),

  brand: belongsTo('brand'),

  departmentMembers: hasMany('department-member'),
  duties: hasMany('duty'),
  reviewTime: attr('number'),
  manager: computed('departmentMembers', function() {
    return get(this, 'departmentMembers').findBy('isManager', true);
  })
});
