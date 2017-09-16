import DS from "ember-data";
import Ember from 'ember';

const {
  computed,
} = Ember;

const {
  attr,
  belongsTo,
  hasMany,
} = DS;

export default DS.Model.extend({
  about: attr('string'),
  address: attr('string'),
  city: attr('string'),
  email: attr('string'),
  password: attr('string'),
  firstName: attr('string'),
  lastName: attr('string'),
  phone: attr('string'),
  username: attr('string'),
  postalCode: attr('string'),

  newPassword: attr('string'),
  oldPassword: attr('string'),
  cnfPassword: attr('string'),

  sessionTimeout: attr('number'),

  country: belongsTo('location'),
  state: belongsTo('location'),

  allowEmail: attr("to-boolean"),
  allowSMS: attr("to-boolean"),
  isVerified: attr("boolean"),
  emailInterval: attr("number"),
  smsInterval: attr("number"),
  smsPhone: attr("string"),
  smsVerified: attr("to-boolean"),
  smsFrequency: belongsTo("frequency"),
  emailFrequency: belongsTo('frequency'),
  invites: hasMany('invite'),
  chatRooms: hasMany('chatRoom'),
  devices: hasMany('device'),
  dnd: attr("to-boolean"),
  dndTimezone: attr('string'),
  dndStartHour: attr('number'),
  dndEndHour: attr('number'),
  dndStartMinute: attr('number'),
  dndEndMinute: attr('number'),
  fullName: computed('firstName', 'lastName', function() {
    return [
      this.get('firstName'),
      this.get('lastName'),
    ].join(' ');
  }),
  name: computed.alias('fullName'),

  cards: hasMany('card'),

  affiliateId: attr("string"),
  cid: attr("string"),
  eid: attr("string"),
  hpid: attr("string"),
  lpid: attr("string"),
  lbid: attr("string")


});
