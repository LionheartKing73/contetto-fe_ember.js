import Ember from 'ember';

export default Ember.Component.extend({
    store: Ember.inject.service('store'),
    didReceiveAttrs() {

        var assignment = this.get("assignment");
        Ember.run.once(this, "getclass", assignment);

    },
    bgclass: "bg-info",
    getclass: function(assignment) {
        var self = this;

        this.get("store").findRecord("changeRequestStatus", assignment.get("status.id")).then((status) => {
            if (status.get("name") == "Pending") {
                self.set("bgclass", "bg-success");
            }
            else {
                self.set("bgclass", "bg-secondary");
            }
        });

    }

});
