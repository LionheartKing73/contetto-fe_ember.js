import DS from "ember-data";
const {
  attr,
  belongsTo,
} = DS;

/* This is the object returned by invite with token request */
export default DS.Model.extend({
  email: attr('string'),
  status: attr('string'),
  role: belongsTo('role'),

  validations: {
    email: {
      presence: true,
      email: true,
    },
    status: {
      presence: true,
    },
    role: {
      presence: true,
    }
  }
});
