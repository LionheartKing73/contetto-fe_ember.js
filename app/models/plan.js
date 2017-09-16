import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import Ember from 'ember';

export default Model.extend({
  name: attr('string'),
  monthPrice: attr('number'),
  yearPrice: attr('number'),
  brandsCount: attr('number'),
  socialAccountsCount: attr('number'),
  type: attr('string'),
  postsCount: attr('number'),
  storageSize: attr('number'),
  teamMembersCount: attr('number'),
  price: Ember.computed(function(){
    if(this.get('monthly')){
      return this.get('monthPrice');
    }
    if(this.get('yearly')){
      return this.get('yearPrice');
    }
  }),
  priceWithUnits: Ember.computed('price', function(){
    let units = "";
    if(this.get('monthly')){
      units+="/mo";
    }
    if(this.get('yearly')){
      units+="/yr"
    }
    return "$"+this.get('price')+units;
  }),
  amount: 1,
  yearly: Ember.computed('type', function(){
    return this.get('type')=='yearly' ? "yearly" : "monthly";
  }),
  monthly: Ember.computed('type', function(){
    return this.get('type')=='monthly' ? "monthly" : "yearly";
  })
});
