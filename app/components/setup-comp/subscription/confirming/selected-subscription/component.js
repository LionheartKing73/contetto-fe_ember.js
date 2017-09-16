import Ember from 'ember';

const {
  Component,
  set,
  get,
  inject,
  computed,
  isEmpty,
  RSVP
} = Ember;

export default Component.extend({
  today: moment().format('LL')
});
