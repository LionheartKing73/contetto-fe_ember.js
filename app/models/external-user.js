import DS from "ember-data";
import attr from 'ember-data/attr';
import {
    belongsTo,
    hasMany
}
from 'ember-data/relationships';

export default DS.Model.extend({
    handle: attr('string'),
    username: attr('string'),
    favoritesCount: attr('number'),
    followersCount: attr('number'),
    friendsCount: attr('number'),
    idStr: attr('string'),
    lang: attr('string'),
    name: attr('string'),
    platform: attr('string'),
    profileBackgroundImageUrl: attr('string'),
    profileImageUrl: attr('string'),
    statusesCount: attr('number')
});
