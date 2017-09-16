import Ember from 'ember';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import {
  belongsTo,
  hasMany
}
from 'ember-data/relationships';


export default Model.extend({
  hour: attr('number'),
  minute: attr('number'),
  dayOfWeek: attr('number'),
  networkType: belongsTo('networkType'),
  socialAccount: belongsTo('socialAccount'),
  timezone: attr('string'),
  sortOn: Ember.computed('hour', 'minute', function() {
    var h = this.get('hour');
    var m = this.get('minute');
    return (h * 60) + m;
  }),

});
