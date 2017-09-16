import Ember from 'ember';

export default Ember.Component.extend({
  engagementURL: Ember.computed('session.brand', function() {
    return "https://gke.contetto.io/social-accounts/v1/engagementMetricsTotal?postingSchedule=" + this.get("ps.id");
  }),
});
