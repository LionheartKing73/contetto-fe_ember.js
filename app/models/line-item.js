import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import Ember from 'ember';
import {
  belongsTo
}
from 'ember-data/relationships';

export default Model.extend({
  itemType: attr('string'),
  itemId: attr('string'),
  quantity: attr('number'),
  factor: attr('number'),
  invoice: belongsTo('invoice'),
  subscription: Ember.computed.alias('invoice.company.subscription'),
  coupon: Ember.computed.alias('subscription.coupon'),
  item: Ember.computed('itemType', 'itemId', function(){
    if(this.get('itemType'))
      return this.store.findRecord(this.get('itemType'), this.get('itemId'));
  }),
  name: Ember.computed('item.name', 'itemType', 'itemId', 'item', function(){
    return this.get('item.name') + "-" + this.get('itemType');
  }),
  cost: Ember.computed('quantity', 'item.price', 'factor', function(){
    let cost = this.get('quantity') * this.get('factor');
    if(this.get('item.price')){
      return cost*this.get('item.price');
    }
    else{
      return 0;
    }
  }),
  couponedCost: Ember.computed('cost', 'coupon', function(){

  })
});
