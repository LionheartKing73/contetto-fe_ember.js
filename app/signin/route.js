import Ember from 'ember';
import SigninValidations from 'contetto/validations/signin';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';

export default Ember.Route.extend(UnauthenticatedRouteMixin, {
  routeIfAlreadyAuthenticated: 'index',

  model(){
    return {
      SigninValidations,
      user: {
        email: null,
        password: null
      }
    };
  }
});