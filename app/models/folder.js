import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import {
    belongsTo,
    hasMany
}
from 'ember-data/relationships';

export default Model.extend({
    name: attr('string'),
    parent: belongsTo('folder', {
        'inverse': 'folders'
    }),
    files: hasMany('file'),
    folders: hasMany('folder'),
    brand: belongsTo('brand')

});
