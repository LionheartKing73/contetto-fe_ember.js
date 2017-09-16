import Ember from 'ember';
import ResetPasswordValidations from 'contetto/validations/reset-password';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';

export default Ember.Route.extend(UnauthenticatedRouteMixin, {
  routeIfAlreadyAuthenticated: 'index',

  model({token}){
    return {
      ResetPasswordValidations,
      user: { password: null, confirmPassword:null, token }
    };
  }
});