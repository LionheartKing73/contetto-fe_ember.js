import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import PostingValidations from 'contetto/validations/posting';
export default Ember.Route.extend(AuthenticatedRouteMixin, {
  ajax: Ember.inject.service('ajax'),
  store: Ember.inject.service('store'),
  model() {
    const {
      brand_id
    } = this.paramsFor('brand.edit');

    const _this = this;
    return Ember.RSVP.hash({
      brandId: brand_id,
      brand: this.store.fetchRecord('brand', brand_id),
      PostingValidations,
      post: this.store.createRecord('posting', {
        'socialAccounts': [],
        'postingSchedules': [],
        'tags': [],
        'changeRequests': [],
        'categories': []
      }),
      campaigns: this.store.query('campaign', {
        brand: brand_id
      }),
      accounts: this.store.query('social-account', {
        brand: brand_id
      }),
      categories: this.store.query('category', {
        brand: brand_id
      }),
      nextRecommended: this.get('ajax').request('https://gke.contetto.io/postings/v1/nextPost?brand=' + brand_id)
    });
  }
});
