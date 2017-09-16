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
  askClearDowngradedAddons: computed('company.isBilling', 'subscription.alreadyDowngradedAddonsPresent', function(){
    return this.get('company.isBilling') && this.get('subscription.alreadyDowngradedAddonsPresent');
  })
});
