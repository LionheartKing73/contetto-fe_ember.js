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
  editAddon: inject.service(),
  toast: inject.service(),
  actions : {
    confirmAddonModify(){
      let downgradationPossibility = this.get('editAddon').downgradationPossibility(this.get('subscription'), this.get('editableSubscriptionAddons.addons'));
      if(downgradationPossibility){
        this.set('confirmAddon', true);
      }
      else{
        this.get('toast').error('Unable to edit addons because you have already crossed usage limits.')
      }

    },
    cancelChanges(){
      this.get('editableSubscriptionAddons').reset();
    }
  }
});
