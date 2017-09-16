import Ember from 'ember';
import CompanyValidations from 'contetto/validations/company';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';

const {
  Route,
  inject,
  RSVP,
  get,
  set
} = Ember;

// CompanyDetailsRoute
export default Route.extend({
  session: inject.service(),
  //model
  model() {
    const company = this.modelFor('company.edit');
    return RSVP.hash({
      company,
      CompanyValidations,
      locations: this.store.findAll('location'),
      notifications: this.store.findAll('notification'),
      changeset: new Changeset(company, lookupValidator(CompanyValidations), CompanyValidations)
    });
  },

  afterModel() {
    set(this, 'session.brand', null);
  },
  deactivate(){
    if (get(this.currentModel, 'company.hasDirtyAttributes')) {
      this.currentModel.company.rollbackAttributes();
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
