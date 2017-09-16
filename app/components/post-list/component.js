import Ember from 'ember';

export default Ember.Component.extend({


    sortDefinition: ['scheduledTime:desc'],
    sorted: Ember.computed.sort('posts', 'sortDefinition'),


});
