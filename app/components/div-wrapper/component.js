import Ember from 'ember';

export default Ember.Component.extend({

    iClass: Ember.computed('doSet', 'setClass', function() {

        if (this.get("doSet")) {
            if (this.get("setClass")) {
                return this.get("setClass");
            }
        }

    }),
    iId: Ember.computed("doSet", "setId", function() {
        if (this.get("doSet")) {
            if (this.get("setId")) {
                return this.get("setId");
            }
        }
    })
});
