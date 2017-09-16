import Ember from 'ember';

export default Ember.Component.extend({
    actions: {
        changeCampaigns: function(campaigns) {
            this.get("updateCampaigns")(campaigns);
        }
    }
});
