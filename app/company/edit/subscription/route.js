import Ember from 'ember';
import subscriptionValidations from 'contetto/validations/subscription';

const {
  set,
  get,
  Route,
  inject,
  setProperties,
  RSVP: {
    hash,
    all
  }
} = Ember;

export default Route.extend({
  session: inject.service(),
  store: inject.service(),
  model() {
    const company = this.modelFor("company.edit");
    const user = this.store.findRecord('user', this.get('session.data.authenticated.userId'));
    const cards = this.store.findAll('card', {
      user: this.get('session.data.authenticated.userId')
    });
    const plans = this.store.findAll('plan');
    const subscription = company.get('subscription');
    const locations = this.store.findAll('location', {
      backgroundReload: false
    });
    const addons = this.store.findAll('addon');
    const addonItems = subscription.get('addonItems');
    const addonTypes = this.store.findAll('addonType');
    const invoices = company.get('invoices');
    return hash({
      company,
      subscription,
      user,
      cards,
      plans,
      locations,
      subscriptionValidations,
      addons,
      addonItems,
      addonTypes,
      invoices
    })
  },
  afterModel(model) {
    if (model.addonItems) {
      return all([
        all(model.addonItems.map((item) => {

          return this.store.findRecord('addonItem', item.get('id'));

        })),
        all(model.invoices.map((invoice) => {
          return invoice.get('lineItems');
        })),
      ]);
    }
    else {

      return all([
        all(model.invoices.map((invoice) => {
          return invoice.get('lineItems');
        })),
      ]);

    }
  }
});
