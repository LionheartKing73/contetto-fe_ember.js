import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

const {
  Route,
  get,
  inject: {
    service
  }
} = Ember;

export default Route.extend(AuthenticatedRouteMixin, {
  store: service('store'),
  session: service('session'),
  model() {
    return Ember.RSVP.hash({
      rooms: this.get('store').query('chatRoom', {
        user: this.get("session.data.authenticated.userId"),
        brand: this.paramsFor('brand.edit')
      })
    });
  }
});
