import Ember from 'ember';

const {
  Component,
  set, get,
  inject: { service }
} = Ember;

export default Component.extend({
  tagName: 'tr',

  toast: service(),

  actions: {
    delete(category) {
      if (confirm('Are you should you want to delete that category. All the child category also will be deleted ?')) {
        let descendants = category.get('descendants');

        set(this, 'deleting', true);
        category.destroyRecord()
        .then(() => {
          descendants.invoke('unloadRecord');
          get(this, 'toast').success('Category deleted successfully!', 'Success');
        })
        .finally(() => set(this, 'deleting', false));
      }
    }
  }
}).reopenClass({
  positionalParams: ['category']
});
