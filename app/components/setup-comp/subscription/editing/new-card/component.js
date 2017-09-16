import Ember from 'ember';

const {
  Component,
  set,
  get,
  inject,
  computed,
  isEmpty,
  RSVP
} = Ember;

export default Component.extend({
  actions: {
    saveCallback(card){
      get(this, 'toast').success('Card Created successfully!', 'Success');
      Ember.run.next(this, ()=>{
        $("#card-form-modal-close").click();
      });
      this.send("selectCard", card);
    },
    cancelCallback(){
      $("#card-form-modal-close").click();
    },
    selectCard(card){
      this.selectCard(card);
    }
  }
});
