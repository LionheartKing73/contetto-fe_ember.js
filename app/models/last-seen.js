import DS from "ember-data";
import Ember from 'ember';

const {
    computed,
} = Ember;

const {
    attr,
    belongsTo,
    hasMany,
} = DS;
export default DS.Model.extend({
    lastSeen: attr('utc-date'),
    room: belongsTo('chatRoom'),
    user: belongsTo('user')
});
