import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

const {
  Route,
  get,
  inject
} = Ember;

export default Route.extend(AuthenticatedRouteMixin, {
  session: inject.service(),

  authenticationRoute:'signin',

  model(){
    const userId = get(this, 'session.data.authenticated.userId');
    return this.store.findRecord('user', userId, { backgroundReload: false });
  },
  afterModel(){
    return this.store.findAll('location');
  }
});
