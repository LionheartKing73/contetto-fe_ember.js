import Ember from 'ember';
import DS from 'ember-data';
import attr from 'ember-data/attr';
import {
    belongsTo,
    hasMany
}
from 'ember-data/relationships';

const {
    computed,
    get,
    isEmpty
} = Ember;

export default DS.Model.extend({
    name: attr('string')

});
