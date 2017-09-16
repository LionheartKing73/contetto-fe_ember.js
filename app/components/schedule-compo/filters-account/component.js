import Ember from 'ember';

export default Ember.Component.extend({
    actions: {
        changeAccounts: function(accounts) {
            this.get("updateAccounts")(accounts);
        }
    }
});
