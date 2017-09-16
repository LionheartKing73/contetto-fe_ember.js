import Ember from 'ember';

export default Ember.Component.extend({
    hasHistory: Ember.computed('changeSet.changeRequests.@each', {get() {
            // alert(this.get("changeSet.changeRequests.length"));
            if (this.get("changeSet.changeRequests.length") > 0) {
                return true;
            }
            return false;
        }
    }),
    sortedChangeRequests: Ember.computed.sort('changeSet.changeRequests', 'sortDefinition'),
    sortDefinition: ['status.id'],

});
