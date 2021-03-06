import DS from 'ember-data';

const {
  attr
} = DS;

export default DS.Model.extend({
  email: attr('string'),

  validations: {
    presence: true,
  }
});
