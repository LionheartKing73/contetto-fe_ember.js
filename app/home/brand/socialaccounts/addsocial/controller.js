import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    showSocialList(brandId) {
      this.transitionToRoute('brand.edit.socialaccounts.list', brandId);
    }
  }
});
