import DS from 'ember-data';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default DS.Model.extend({
  isManager: attr('to-boolean', { defaultValue: false }),

  user: belongsTo('user'),
  department: belongsTo('department', { inverse: 'departmentMembers' })
});
