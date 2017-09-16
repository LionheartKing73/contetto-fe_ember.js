import Ember from 'ember';

const {
  get,
  inject: { service }
} = Ember;

//name, unitPrice, unitPerk, count, price, perks
export default Ember.Object.extend({
  price: Ember.computed('unitPrice', 'count', function(){
    return this.get('unitPrice')*this.get('count');
  }),
  perks: Ember.computed('unitPerks', 'count', function(){
    return this.get('unitPerks')*this.get('count');
  }),
  newCountObs: Ember.observer('newCount', function(){
    let val = parseInt(this.get('newCount'));
    if (isNaN(val) || val <= 0) {
      this.set('newCount', 0);
    }
    else{
      this.set('newCount', val);
    }
  }),
  newPrice: Ember.computed('newCount', function(){
    return this.get('unitPrice')*this.get('newCount');
  }),
  newPerks: Ember.computed('newCount', function(){
    return this.get('unitPerks')*this.get('newCount');
  })
});
