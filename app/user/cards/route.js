import Ember from 'ember';
import cardValidations from 'contetto/validations/card';

const {
  set,
  get,
  Route,
  inject,
  setProperties,
  RSVP: {
    hash
  }
} = Ember;

export default Route.extend({
  session: inject.service(),
  store: inject.service(),
  toast: inject.service(),
  model() {
    return hash({
      cards: this.store.findAll("card"),
      card: this.store.createRecord('card', {
        user: this.modelFor('user').user
      }),
      locations: this.store.findAll('location', {
        backgroundReload: false
      }),
      cardValidations: cardValidations,
      createNew: false
    });
  },
  actions: {
    new() {
      setProperties(this.currentModel, {
        createNew: true
      });
    },
    removeCard(card) {
      if (confirm("Would you like to remove this card?")) {
        card.destroyRecord().then((response) => {
          this.get('toast').success("Card has been successfully removed");
        });
      }
    }
  }
});
