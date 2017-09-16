import Ember from 'ember';
import subscriptionValidations from 'contetto/validations/subscription';

const {
  set,
  get,
  Route,
  inject,
  setProperties,
  RSVP: { hash, all }
} = Ember;

export default Route.extend({
  session: inject.service(),
  store: inject.service(),
  model(){
    const company = this.modelFor("company.edit");
    const user = this.store.findRecord('user', this.get('session.data.authenticated.userId'));
    const invoices = company.get('invoices');
    const lineItemsPromise = all(invoices.map((invoice) => {
      return invoice.get('lineItems')
    }));
    const paymentsPromise = all(invoices.map((invoice) => {
      return invoice.get('payments')
    }));
    return hash({
      company,
      user,
      invoices,
      lineItemsPromise,
      paymentsPromise
    });
  },
  actions: {
    fixPayment(invoice){
      invoice.set('fixPayment', true);
    }
  }
});
