import Ember from 'ember';

export default Ember.Component.extend({
    changeRequestStatuses: [],
    store: Ember.inject.service('store'),
    init: function() {
        var component = this;
        this.get('store').fetchRecord('changeRequestStatus', 1).then((crs) => {
            if (!component.get("changeRequestStatuses").includes(crs)) {
                component.get("changeRequestStatuses").pushObject(crs);
            }
        });
        this.get('store').fetchRecord('changeRequestStatus', 2).then((crs) => {
            if (!component.get("changeRequestStatuses").includes(crs)) {
                component.get("changeRequestStatuses").pushObject(crs);
            }
        });

        return this._super();
    },
    actions: {
        changeStatus(status) {
            this.get("updateStatus")(status);
        }
    }
});
