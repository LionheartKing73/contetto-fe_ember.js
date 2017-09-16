import DS from "ember-data";
import attr from 'ember-data/attr';
import {
    belongsTo,
    hasMany
}
from 'ember-data/relationships';

export default DS.Model.extend({
    count: attr('number'),
    brand: belongsTo('brand'),
    messages: hasMany('inboxItem'),
    socialAccount: belongsTo('socialAccount'),
    tags: hasMany('tags'),
    topMessage: belongsTo('inboxItem'),
    users: hasMany('user')

});
