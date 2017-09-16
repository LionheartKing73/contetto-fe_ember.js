import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';


const {
  get, Route,
  RSVP: { hash },
  inject: { service }
} = Ember;


export default Route.extend(AuthenticatedRouteMixin, {
  toast: service('toast'),

  model() {
    const brand = this.modelFor('brand.edit');
    const brandId = get(brand, 'id');
    const store = get(this, 'store');

    return hash({
      audiences: store.query('audience', { brandId }),
      brand: brand,
      isTargetAudienceTabActive: true
    });
  }
});
