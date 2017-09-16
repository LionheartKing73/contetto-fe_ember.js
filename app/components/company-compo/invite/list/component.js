import Ember from 'ember';

const {
  Component,
  computed
} = Ember;

export default Component.extend({
  invites: computed.oneWay('model'),

  actions: {
    cancel(){}
  }
});
