import Ember from 'ember';
import brandRoleValidations from 'contetto/validations/brand-role';
import BrandAuthorization from 'contetto/mixins/brand-authorization';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';


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

  model() {
    var role = this.store.createRecord('brand-role', {
      brand: this.modelFor('brand.edit'),
      isEditable: true
    });
    return hash({
      brandRoleValidations,
      role,
      changeset: new Changeset(role, lookupValidator(brandRoleValidations), brandRoleValidations)
    });
  },
  deactivate(){
    if (this.currentModel.role.get('isNew')) {
      this.currentModel.role.destroyRecord();
    }
  },
  actions: {
    willTransition: function(transition){
      if(!this.currentModel.changeset.get("isDirty")){
        return true;
      }
      else if(confirm("Your information will be lost, if you exit this page. Are you sure?")){
        return true;
      }
      else{
        transition.abort();
      }
    }
  }
});
