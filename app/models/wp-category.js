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
  title: attr('string'),

  socialAccount: belongsTo('socialAccount'),
  parent: belongsTo('category', {
    inverse: 'children'
  }),

  children: hasMany('category', {
    inverse: 'parent'
  }),

  descendants: computed(function() {
    var desc = [],
      children = get(this, 'children');

    if (isEmpty(children)) {
      return [];
    }

    desc.pushObjects(children.toArray());

    children.map((child) => {
      desc.pushObjects(child.get('descendants'));
    });

    return desc;
  }).readOnly()
});
