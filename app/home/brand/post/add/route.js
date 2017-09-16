import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  beforeModel(transition) {
    Ember.setProperties(transition.resolvedModels.home, {
      '_isTopMenuOpened': false,
      '_isInboxNavMenuHide': true,
      '_isRightSideMenuOpened': false,
      '_isLeftSideMenuOpened': false,
      '_isRightFilterMenuHide': true
    });
  },

  model() {
    const { brand_id } = this.paramsFor('brand.edit');

    return Ember.RSVP.hash({
      brandId: brand_id,
      post: this.store.createRecord('post'),
      campaigns: this.store.query('campaign', { brand: brand_id }),
      accounts: this.store.query('social-account', { brand: brand_id }),
      categories: this.store.query('category', { brand: brand_id })
    });
  }
});
