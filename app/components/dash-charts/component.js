import Ember from 'ember';

export default Ember.Component.extend({
    session: Ember.inject.service('session'),
    engagementURL: Ember.computed('session.brand', function() {
        return "https://gke.contetto.io/social-accounts/v1/engagementMetricsTotal?brand=" + this.get("session.brand.id");
    }),
    growthURL: Ember.computed("session.brand", function() {
        return "https://gke.contetto.io/social-accounts/v1/pageMetrics?brand=" + this.get("session.brand.id");
    }),
});
