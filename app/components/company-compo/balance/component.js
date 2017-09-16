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
    clear(){
      this.set('clearing', true);
    },
    cancelClearing(){
      this.set('clearing', false);
    },
    showCardsChanged(){
      if(this.get("showCards")){
        this.set("createNew", false);
      }
    },
    createNewChanged(){
      if(this.get("createNew")){
        this.set("showCards", false);
      }
    },
    selectCard(card){
      this.set("selectedCard", card);
    },
    confirmPay(){
      let payment = this.get('store').createRecord('payment', {
        card: this.get('selectedCard'),
        invoice: this.get('invoice'),
        amount: this.get('invoice.amount')
      });
      payment.save().then((record) => {
        record.get("paymentStatus").then((status) => {
          if(status.get('name')=="Complete"){
            this.get("toast").success("Payment Successful!");
            this.set("company.balance", 0);
            this.transitionTo("company.edit", this.get("company.id"));
          }
          else{
            this.get("toast").error("Payment " + status.get("name"));
          }
        });
      }).catch((record) => {
        this.get("toast").error("Unable to process payment");
      });
    }
  }
});
