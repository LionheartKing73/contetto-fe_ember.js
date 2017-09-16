import Ember from 'ember';
import CompanyInviteValidations from 'contetto/validations/company-invite';
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
  authorizationFailedRoute: 'company.edit.invites.list',

  model(){
    const company = this.modelFor('company.edit');
    var invite = this.store.createRecord('invite', { type: 'company', company });
    return RSVP.hash({
      CompanyInviteValidations,
      invite,
      roles: this.store.query('companyRole', { id: get(company, 'id') }),
      changeset: new Changeset(invite, lookupValidator(CompanyInviteValidations), CompanyInviteValidations)
    });
  },

  deactivate(){
    if (get(this.currentModel, 'invite.isNew')) {
      this.currentModel.invite.destroyRecord();
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
