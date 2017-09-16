import Ember from 'ember';
import moment from 'moment';
import cardValidations from 'contetto/validations/card';

const {
  Route,
  setProperties,
  RSVP,
  get,
  inject
} = Ember;

export default Route.extend({
  session: inject.service(),

  model({ company_id }){
    const userId = get(this, 'session.data.authenticated.userId');
    return RSVP.hash({
      user: this.store.findRecord('user', userId, { backgroundReload: false }),
      company: this.store.findRecord('company', company_id),
      plans: this.store.findAll('plan'),
      locations: this.store.findAll('location', { backgroundReload: false }),
      cards: this.store.findAll('card', {
        user: userId
      })
    });
  },

  afterModel(model){
    let subscription = this.store.createRecord('subscription', {
      company: model.company,
      startDate: moment.utc(),
      endDate: moment.utc().add(1, 'month'),
    });
    let card = this.store.createRecord('card', {
      user: model.user,
    });
    setProperties(model, {
      subscription,
      card,
      cardValidations
    });
  },

  deactivate(){
    if (get(this.currentModel.card, 'isNew')) {
      this.currentModel.card.destroyRecord();
    }
    if (get(this.currentModel.subscription, 'isNew')) {
      this.currentModel.subscription.destroyRecord();
    }
  }
});
