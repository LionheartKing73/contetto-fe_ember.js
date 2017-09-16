import Model from 'ember-data/model';
import attr from 'ember-data/attr';


export default Model.extend({
  canonicalName: attr('string'),
  categoryId: attr('number'),
  countryCode: attr('string'),
  name: attr('string'),
  parentId: attr('number'),
  status: attr('string'),
  targetType: attr('string'),

  validations: {
    canonicalName: {
      presence: true,
    },
    categoryId: {
      presence: true,
    },
    countryCode: {
      presence: true,
    },
    name: {
      presence: true,
    },
    parentId: {
      presence: true,
    },
    status: {
      presence: true,
    },
    targetType: {
      presence: true,
    },
  }
});
