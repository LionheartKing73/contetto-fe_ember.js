import Ember from 'ember';

const {
  Component,
  set,
  get,
  inject: { service }
} = Ember;

export default Component.extend({
  tagName: 'tr',

  toast: service(),

  actions: {
    delete(goal){
      if (confirm('Are you sure you want to delete that goal ?')) {
        set(this, 'deleting', true);
        goal.destroyRecord()
          .then(() => get(this, 'toast').success('Goal deleted successfully!', 'Success'))
          .finally(() => set(this, 'deleting', false));
      }
    }
  }
}).reopenClass({
  positionalParams: ['goal']
});
