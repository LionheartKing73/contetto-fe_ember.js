import DS from "ember-data";
const {
  attr,
  belongsTo,
  hasMany
} = DS;

export default DS.Model.extend({

  name: attr('string'),
  categories: hasMany('category'),
  goal: belongsTo('campaignGoal'),
  product: belongsTo('product'),
  socialAccounts: hasMany("socialAccount"),
  startDate: attr('string'),
  lengthNumber: attr('number'),
  brand: belongsTo('brand'),
  createdOn: attr('string'),
  isPaused: attr("to-boolean"),
  room: belongsTo('chatRoom')
});
