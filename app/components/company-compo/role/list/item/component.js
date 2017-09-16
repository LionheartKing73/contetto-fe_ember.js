import Ember from 'ember';

const {
  Component,
  computed,
  set,
  get
} = Ember;

export default Component.extend({
  tagName: 'tr',

  role: computed.oneWay('model'),

  actions: {
    delete(role){
      if (confirm('Are you sure you want to delete that role ?')) {
        set(this, 'deleting', true);
        role.destroyRecord()
          .then(() => get(this, 'toast').success('Role deleted successfully!', 'Success'))
          .finally(() => set(this, 'deleting', false));
      }
    }
  }
});
