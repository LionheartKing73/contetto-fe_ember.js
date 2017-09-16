import Ember from 'ember';
import CompanyMemberValidations from 'contetto/validations/company-member';
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
  authorizationFailedRoute: 'company.edit.member.list',

  model({
    member_id
  }) {
    const {
      company_id
    } = this.paramsFor('company.edit');
    var member = this.store.findRecord('companyMember', member_id);
    return RSVP.hash({
      CompanyMemberValidations,
      member,
      roles: this.store.query('companyRole', {
        id: company_id
      }),
      changeset: new Changeset(member, lookupValidator(CompanyMemberValidations), CompanyMemberValidations)
    });
  },
  deactivate(){
    if (get(this.currentModel, 'member.hasDirtyAttributes')) {
      this.currentModel.member.rollbackAttributes();
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
