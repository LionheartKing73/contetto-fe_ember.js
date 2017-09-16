import Ember from 'ember';

export default Ember.Component.extend({
    actions: {
        removeSubscription: function(s) {
            this.get("removeSubscriptionAction")(s);
        }
    }
});
