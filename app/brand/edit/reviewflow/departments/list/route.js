import Ember from 'ember';
import BrandAuthorization from 'contetto/mixins/brand-authorization';

const {
  Route,
  inject,
  get, set
}= Ember;

export default Route.extend(BrandAuthorization, {
  toast: inject.service(),
  authorizationAttribute: 'manageReviewStructure',

  model() {
    const { brand_id } = this.paramsFor('brand.edit');

    return this.store.query('department', { brand: brand_id });
  },

  actions: {
    removeDept(dept) {
      if (confirm('Please confirm that you want to remove this department?')){
        set(this, 'deleting', true);
        dept.destroyRecord().then(() => {
          get(this, 'toast').success('Department has been removed successfully.');
        }, () => {
          console.log('Failed to delete department.');
        }).finally(() => set(this, 'deleting', false));
      }
    }
  }
});
