import DS from "ember-data";
import attr from "ember-data/attr";
import { belongsTo, hasMany } from "ember-data/relationships";

export default DS.Model.extend({
  name: attr('string'),
  order: attr('number'),
  createdDate: attr('utc-date'),

  reviewChannel: belongsTo('reviewChannel'),
  department: belongsTo('department')
});
