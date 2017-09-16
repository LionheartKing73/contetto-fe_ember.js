import Ember from 'ember';

const {
  Route,
  get,
  inject,
  RSVP
} = Ember;

export default Route.extend({
  session: inject.service(),

  model(){
    const user = this.modelFor('index');

    return RSVP.hash({
      company: this.store.query('invite', { type: 'company', email: get(user, 'email'), include: 'company' }),
      brand: this.store.query('invite', { type: 'brand', email: get(user, 'email'), include: 'brand' })
    });

  },

  afterModel(model){
    if (!get(model, 'company').isAny('status', 'waiting') && !get(model, 'brand').isAny('status', 'waiting')) {
      this.transitionTo('client');
    } else {
      let promises = get(model, 'brand').getEach('brandRole');
      promises.pushObjects(get(model, 'brand').getEach('brand'));
      promises.pushObjects(get(model, 'company').getEach('companyRole'));
      promises.pushObjects(get(model, 'company').getEach('company'));
      return RSVP.allSettled(promises);
    }
  }
});
