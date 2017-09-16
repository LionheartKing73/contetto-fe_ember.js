import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';


export default Model.extend({
  title: attr('string'),
  ageRanges: hasMany('audiencesData'),
  genders: hasMany('audiencesData'),
  locations: hasMany('location'),
  brand: belongsTo('brand', { inverse: 'targetAudiences'})
});
