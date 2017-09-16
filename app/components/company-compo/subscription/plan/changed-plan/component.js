import Ember from 'ember';

const {
  Component,
  get,
  set,
  isEmpty,
  inject,
  computed,
  RSVP,
  observer
} = Ember;

export default Component.extend({
  changePlan: inject.service(),
  actions: {
    removeChangedPlan() {
      this.get('changePlan').removeChangedPlan(this.get('subscription'));
    }
  }
});
