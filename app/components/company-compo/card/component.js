import Ember from 'ember';
import cardValidations from 'contetto/validations/card';

const {
  Component,
  get,
  set,
  isEmpty,
  inject,
  computed,
  RSVP
} = Ember;

export default Component.extend({
  store: inject.service(),
  toast: inject.service(),
  changeCard: false,
  init(){
    this.set('cardValidations', cardValidations);
    this.set('newCard', this.get('store').createRecord('card', {
      user: this.get('user')
    }));
    if(!!this.get("cards.length")){
      this.set("showCards", true);
      this.set("createNew", false);
    }
    else{
      this.set("showCards", false);
      this.set("createNew", true);
    }
    this._super(...arguments);
  },
  actions: {
    changeCard(){
      this.set("changeCard", true);
    },
    cancelChangeCard(){
      this.set("changeCard", false);
    },
    createNewChanged(){
      this.set('createNew', true);
      this.set("showCards", false);
    },
    selectCard(card){
      this.set("selectedCard", card);
    },
    updateCard(card){
      this.set('subscription.card', card);
      this.get('subscription').save().then((subscription) => {
        this.set("saving", false);
        get(this, 'toast').success('Card updated successfully!', 'Success');
        this.set('changeCard', false);
      }).catch(() => set(this, 'saving', false));
    }
  }
});
