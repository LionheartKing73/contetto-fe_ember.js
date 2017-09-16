import DS from "ember-data";
import Ember from "ember";
const {
  attr,
  belongsTo,
  hasMany
} = DS;

export default DS.Model.extend({

  name: attr('string'),
  cleanName: Ember.computed('name', {get() {
      var name = this.get('name');
      if (name) {
        if (name != null && name != undefined) {
          return name.replace(/([A-Z])/g, ' $1').trim()
        }
        else {
          return null;
        }
      }
      else {
        return null;
      }
    }
  })
});
