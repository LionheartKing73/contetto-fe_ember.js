import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import Ember from 'ember';
import {
  belongsTo
}
from 'ember-data/relationships';

export default Model.extend({
  amount: attr('number'),
  amountWithUnit: Ember.computed('name', function(){
    if(this.get('name')=="Storage"){
      return this.get('amount')+" GB";
    }
    return this.get('amount');
  }),
  price: attr('number'),
  addonType: belongsTo('addon-type'),
  name: Ember.computed.alias('addonType.name')
});
