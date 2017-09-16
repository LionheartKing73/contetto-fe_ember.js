import Ember from 'ember';

const {
  Route
} = Ember;

export default Route.extend({
  model(){
    const { company_id } = this.paramsFor('company.edit');
    return this.store.query('companyInvite', { company: company_id, status: 'waiting' });
  },

  afterModel(model){
    return model.get('companyRole');
  }
});
