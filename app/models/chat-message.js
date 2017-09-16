import DS from "ember-data";
import attr from 'ember-data/attr';
import {
  belongsTo,
  hasMany
}
from 'ember-data/relationships';

export default DS.Model.extend({

  message: attr('string'),
  date: attr('date'),
  room: belongsTo('chatRoom'),
  user: belongsTo('user'),
  mentions: hasMany('user'),
  edited:attr('to-boolean'),
  attachments: hasMany('file'),
  pinned: attr('to-boolean'),
  checked: attr('to-boolean')
});
