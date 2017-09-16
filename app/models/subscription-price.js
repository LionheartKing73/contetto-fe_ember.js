import DS from 'ember-data';
import attr from 'ember-data/attr';
import {
    belongsTo,
    hasMany
}
from 'ember-data/relationships';

export default DS.Model.extend({

    price: attr('number'),

    setupFee: attr('number'),

    currency: belongsTo('currency'),

    frequency: belongsTo('frequency'),

    product: belongsTo('product')


});
