import Ember from 'ember';

export default Ember.Controller.extend({
    actions: {
        updateEngagementChannel(cs, channel) {
            cs.set("engagementChannel", channel);

        },
        updateMarketingChannel: function(cs, channel) {
            cs.set("marketingChannel", channel);

        },
        updateMarketingPostingScheduleMode: function(cs, channel) {
            cs.set("marketingPostScheduleMode", channel);

        },
        updateEngagementPostingScheduleMode: function(cs, channel) {
            cs.set("engagementPostScheduleMode", channel);

        }

    }
});
