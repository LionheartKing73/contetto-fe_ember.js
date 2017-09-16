import Ember from 'ember';

const {
  Component,
  get, set,
  inject: { service }
} = Ember;

export default Component.extend({
  tagName: 'tr',

  toast: service(),

  actions: {
    delete(product) {
      if (confirm('Are you should you want to delete that Product?')) {
        set(this, 'deleting', true);
        product.destroyRecord()
        .then(() => {
          get(this, 'toast').success('Product deleted successfully!', 'Success');
        })
        .finally(() => set(this, 'deleting', false));
      }
    }
  }
});
