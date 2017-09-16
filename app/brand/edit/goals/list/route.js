import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

const {
  Route,
  RSVP: { hash }
}  = Ember;

export default Route.extend(AuthenticatedRouteMixin, {
  model(){
    const { brand_id } = this.paramsFor('brand.edit');
    return hash({
      goals: this.store.query('goal', { brand: brand_id })
    });
  }
});
