import Ember from 'ember';

const {
  set,
  get,
  Route,
  inject,
  setProperties,
  RSVP: { hash }
} = Ember;

export default Route.extend({
  store: inject.service(),
  session: inject.service(),
  toast: inject.service(),
  model(){
    const company = this.modelFor("company.edit");
    const invoice = this.store.findRecord('invoice', 1);
    const user = this.store.findRecord('user', this.get('session.data.authenticated.userId'));
    const cards = this.store.findAll('card');
    company.set('balance', 100);
    return hash({
      company,
      invoice,
      user,
      cards
    })
  },
  actions: {
    willTransition(transition){
      if(!!this.currentModel.company.get('balance') && transition.state.params['company.edit'].company_id==this.currentModel.company.id){
        this.get('toast').error("Please clear the balance or navigate to other company");
        transition.abort();
      }
    }
  }
});
