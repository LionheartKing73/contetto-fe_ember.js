import DS from 'ember-data';
import attr from 'ember-data/attr';
import {
    belongsTo,
    hasMany
}
from 'ember-data/relationships';

const {
    computed,
    get
} = Ember;

export default DS.Model.extend({
    platform: attr('string'),
    deviceName: attr('string'),
    deviceType: attr('string'),
    token: attr('string'),
    userDeviceName: attr('string'),
    user: belongsTo('user'),
    isMute: attr('to-boolean')

});
