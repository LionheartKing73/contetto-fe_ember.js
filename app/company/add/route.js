import Ember from 'ember';
import CompanyValidations from 'contetto/validations/company';

const {
  Route,
  inject,
  RSVP,
  get,
  setProperties
} = Ember;

// CompaniesAddRoute
export default Route.extend({
  session: inject.service(),

  model() {
    return RSVP.hash({
      CompanyValidations,
      locations: this.store.findAll('location', { backgroundReload: false }),
      company: this.store.createRecord('company')
    });
  },

  afterModel(){
    setProperties(this, {
      'session.company': null,
      'session.brand': null,
      'session.currentBrandRole': null
    });
  },

  deactivate(){
    if (get(this.currentModel, 'company.isNew')) {
      this.currentModel.company.destroyRecord();
    }
  }
});
