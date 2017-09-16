import Ember from 'ember';

const {
  Component,
  computed,
  set,
  get
} = Ember;

export default Component.extend({
  tagName: 'tr',

  invite: computed.oneWay('model'),

  actions: {
    delete(invite){
      if (confirm('Are you sure you want to delete that invitation ?')) {
        set(this, 'deleting', true);
        invite.destroyRecord()
          .then(() => get(this, 'toast').success('Invitation deleted successfully!', 'Success'))
          .finally(() => set(this, 'deleting', false));
      }
    }
  }
});
