import Ember from 'ember';
import DS from 'ember-data';
import attr from 'ember-data/attr';
import {
  belongsTo
}
from 'ember-data/relationships';

const {
  computed,
  get
} = Ember;

export default DS.Model.extend({
  name: attr('string'),

  administrator: attr('to-boolean'),
  manageBrands: attr('to-boolean'),
  manageStaff: attr('to-boolean'),
  manageCompanyDetails: attr('to-boolean'),
  company: belongsTo('company'),
  isEditable: attr('to-boolean'),
  isNotEditable: computed.not('isEditable')

});
