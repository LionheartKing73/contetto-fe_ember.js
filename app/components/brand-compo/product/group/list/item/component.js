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
    delete(productGroup) {
      if (confirm('Are you should you want to delete that Product Group?')) {
        set(this, 'deleting', true);
        productGroup.destroyRecord()
        .then(() => {
          get(this, 'toast').success('Product Group deleted successfully!', 'Success');
        })
        .finally(() => set(this, 'deleting', false));
      }
    }
  }
});
