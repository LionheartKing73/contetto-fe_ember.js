import DS from 'ember-data';

export default DS.Model.extend({
    vertical: DS.attr('string'),
    brand: DS.belongsTo('brand')
});
