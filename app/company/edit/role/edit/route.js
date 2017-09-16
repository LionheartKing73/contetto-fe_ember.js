import Ember from 'ember';
import RoleValidations from 'contetto/validations/role';
import CompanyAuthorization from 'contetto/mixins/company-authorization';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';

const {
  Route,
  RSVP,
  get
} = Ember;

export default Route.extend(CompanyAuthorization, {
  authorizationAttribute: 'manageStaff',
  authorizationFailedRoute: 'company.edit.role.list',

  model({ role_id }){
    var role = this.store.findRecord('companyRole', role_id);
    return RSVP.hash({
      RoleValidations,
      role: role,
      changeset: new Changeset(role, lookupValidator(RoleValidations), RoleValidations)
    });
  },
  deactivate(){
    if (get(this.currentModel, 'role.hasDirtyAttributes')) {
      this.currentModel.role.rollbackAttributes();
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
