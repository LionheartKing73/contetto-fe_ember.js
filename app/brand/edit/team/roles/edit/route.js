import Ember from 'ember';
import brandRoleValidations from 'contetto/validations/brand-role';
import BrandAuthorization from 'contetto/mixins/brand-authorization';

const {
  Route,
  inject: { service },
  RSVP: { hash }
} = Ember;

export default Route.extend(BrandAuthorization, {
  session: service(),
  toast: service(),
  authorizationAttribute: 'manageTeam',
  authorizationFailedRoute: 'brand.edit.team.roles.list',

  model(params) {
    return hash({
      brandRoleValidations,
      role: this.store.findRecord('brand-role', params.role_id) //fetch role from existing
    });
  }
});
