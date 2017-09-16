import Ember from 'ember';

export default Ember.Component.extend({
    actions: {
        deleteCampaign: function(campaign) {
            if (confirm("Delete this campaign?")) {
                campaign.deleteRecord();
                campaign.save();
            }
        }
    }
});
