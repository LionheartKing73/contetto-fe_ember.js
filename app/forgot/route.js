import Ember from 'ember';
import ForgotPasswordValidations from 'contetto/validations/forgot-password';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';

export default Ember.Route.extend(UnauthenticatedRouteMixin, {
  routeIfAlreadyAuthenticated: 'index',

  model(){
    return {
      ForgotPasswordValidations,
      user: { email: null }
    };
  }
});