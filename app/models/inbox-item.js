import DS from "ember-data";
import attr from 'ember-data/attr';
import Ember from 'ember';
import {
    belongsTo,
    hasMany
}
from 'ember-data/relationships';

export default DS.Model.extend({
    archive: attr('to-boolean'),
    complete: attr('to-boolean'),
    content: attr("string"),
    createdAt: attr("utc-date"),
    externalURL: attr('string'),
    isDraft: attr('to-boolean'),
    read: attr('to-boolean'),
    removed: attr('to-boolean'),
    viewed: attr('to-boolean'),
    sentByBrand: attr('to-boolean'),
    brand: belongsTo('brand'),
    inboxAction: belongsTo('inboxAction'),
    parentItem: belongsTo('inboxItem', {
        inverse: 'childItems'
    }),
    receiver: belongsTo('externalUser'),
    room: belongsTo('inboxRoom', {
        inverse: null
    }),
    sender: belongsTo('externalUser'),
    account: belongsTo('socialAccount'),
    socialAccount: Ember.computed('account', function() {
        return this.get("account");
    }),
    tags: hasMany('tags'),
    user: belongsTo('user'),
    file: belongsTo('file'),
    imageURL: attr('string'),
    images: attr(),
    childItems: hasMany('inboxItem'),
    posting: belongsTo('posting'),
    rating: attr('number'),
    flagged: attr('to-boolean'),
    sentiment: attr('number'),
    googleSentiment: attr('number')
});
