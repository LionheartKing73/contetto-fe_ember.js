import Ember from 'ember';
import DS from 'ember-data';
import attr from 'ember-data/attr';
import {
  belongsTo,
  hasMany
}
from 'ember-data/relationships';

const {
  computed,
  get,
  isEmpty
} = Ember;

export default DS.Model.extend({
  platform: attr('string'),
  offset: attr('number'),
  template: belongsTo('followupTemplate'),
  offsetType: belongsTo('offsetType'),
  calctime: Ember.computed('offset', 'offsetType.name', function() {

    if (this.get("offsetType.name") == "Immediate") {
      return 0;
    }
    if (this.get("offsetType.name") == "Minute") {
      return this.get("offset");
    }
    if (this.get("offsetType.name") == "Hour") {
      return (this.get("offset") * 60);
    }
    if (this.get("offsetType.name") == "Day") {
      return (this.get("offset") * 1440);
    }
    if (this.get("offsetType.name") == "Week") {
      return (this.get("offset") * 10080);
    }
    if (this.get("offsetType.name") == "Month") {
      return (this.get("offset") * 40320);
    }

  }),
  friendlyName: Ember.computed('offset', 'offsetType.name', function() {

    if (this.get("offsetType.name") == "Immediate") {
      return "Immediate";
    }
    if (this.get("offsetType.name") == "Minute") {
      if (this.get("offset") > 1) {
        return this.get("offset") + " Minutes";
      }
      return this.get("offset") + " Minute";
    }
    if (this.get("offsetType.name") == "Hour") {
      if (this.get("offset") > 1) {
        return this.get("offset") + " Hours";
      }
      return this.get("offset") + " Hour";
    }
    if (this.get("offsetType.name") == "Day") {
      if (this.get("offset") > 1) {
        return this.get("offset") + " Days";
      }
      return this.get("offset") + " Day";
    }
    if (this.get("offsetType.name") == "Week") {
      if (this.get("offset") > 1) {
        return this.get("offset") + " Weeks";
      }
      return this.get("offset") + " Week";
    }
    if (this.get("offsetType.name") == "Month") {
      if (this.get("offset") > 1) {
        return this.get("offset") + " Months";
      }
      return this.get("offset") + " Month";
    }

  })

});
