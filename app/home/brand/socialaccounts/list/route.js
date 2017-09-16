import Ember from 'ember';

const SocialAccountListRoute = Ember.Route.extend({
  model() {
    const { brand_id } = this.paramsFor('brand.edit');
    return this.store.query('social-account', { brand: brand_id });
  }
});

export default SocialAccountListRoute;
