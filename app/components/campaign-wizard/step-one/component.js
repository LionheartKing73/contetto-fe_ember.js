import Ember from 'ember';

export default Ember.Component.extend({
    cleanGoals: Ember.computed('hasProduct', 'goals', {get() {
            if (this.get("hasProduct")) {
                return this.get("goals");
            }
            else {
                var filtered = [];
                this.get("goals").map(function(goal) {
                    if (goal.get("name") == "ProductPromotion") {
                        filtered.pushObject(goal);

                    }
                });
                return filtered;
            }
        }
    }),
    actions: {
        nextStep: function() {
            this.get("nextStep")();
        }
    }
});
