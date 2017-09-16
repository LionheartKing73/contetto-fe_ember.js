import DS from "ember-data";

const {
  attr,
  belongsTo
} = DS;

export default DS.Model.extend({
  email: attr('string'),
  leave: attr('to-boolean'),

  user: belongsTo('user'),
  brandRole: belongsTo('brandRole'),
  brand: belongsTo('brand')
});
