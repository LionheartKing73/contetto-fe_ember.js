import Ember from 'ember';

export default Ember.Component.extend({
    store: Ember.inject.service('store'),
    postingStatuses: [],
    init: function() {
        this.get('store').findAll("postingStatus").then((statuses) => {
            this.set("postingStatuses", statuses);
        });
        return this._super();
    },
    actions: {
        changeStatus: function(status) {
            this.get("updateStatuses")(status);
        }
    }
});
