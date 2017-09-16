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
    url: attr('string'),
    product: belongsTo('product', {
        inverse: null
    })
});
