import DS from "ember-data";

const {
  attr,
  belongsTo,
} = DS;

export default DS.Model.extend({
  email: attr('string'),
  leave: attr('number'),

  company: belongsTo('company'),
  user: belongsTo('user'),
  companyRole: belongsTo('companyRole')
});
