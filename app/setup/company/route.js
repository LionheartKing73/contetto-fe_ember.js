import Ember from 'ember';
import companyValidations from 'contetto/validations/company';

const { Route, get } = Ember;

export default Route.extend({
  model(){
    let company = this.store.createRecord('company');
    return {
      company,
      companyValidations
    };
  },

  deactivate(){
    if (get(this.currentModel.company, 'isNew')) {
      this.currentModel.company.destroyRecord();
    }
  }
});
