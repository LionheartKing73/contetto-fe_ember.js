import DS from "ember-data";
import attr from 'ember-data/attr';
import {
  belongsTo
}
from 'ember-data/relationships';

export default DS.Model.extend({
  name: attr('string'),
  downloadLink: attr('string'),
  fileType: attr('string'),
  mimeType: attr('string'),
  imageWidth: attr('string'),
  imageHeight: attr('string'),
  videoLength: attr('string'),
  fileSize: attr('string'),
  brand: belongsTo('brand'),
  company: belongsTo('company'),
  folder: belongsTo('folder')
});
