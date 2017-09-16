import DS from 'ember-data';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';

export default DS.Model.extend({
  name: attr('string'),
  description: attr('string'),

  brand: belongsTo('brand'),

  products: hasMany('products', { inverse: 'groups' })
});
