import DS from 'ember-data';
import attr from 'ember-data/attr';
import { belongsTo} from 'ember-data/relationships';

export default DS.Model.extend({
  dataPoint: attr('number'),
  date: attr('date'),
  platform: attr('string'),

  socialAccount: belongsTo('social-account')
});
