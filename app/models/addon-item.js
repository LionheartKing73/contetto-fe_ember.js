import Ember from "ember";
import Model from "ember-data/model";
import attr from "ember-data/attr";
import {belongsTo} from "ember-data/relationships";

export default Model.extend({
  startDate: attr('utc-date'),
  endDate: attr('utc-date'),
  addon: belongsTo('addon'),
  subscription: belongsTo('subscription'),
  name: Ember.computed.alias('addon.name'),
  addonAmount: Ember.computed.alias('addon.amount'),
  addonPrice: Ember.computed.alias('addon.price'),
  valid: Ember.computed('endDate', function(){
    return !this.get('endDate') || moment(this.get('endDate'))>moment();
  })
});
