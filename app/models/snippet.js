import DS from "ember-data";
const {
  attr,
  belongsTo,
  hasMany
} = DS;

export default DS.Model.extend({
  name: attr('string'),
  parent: belongsTo('posting')
});
