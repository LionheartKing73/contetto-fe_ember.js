import Ember from 'ember';
import DS from 'ember-data';
import moment from 'moment';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

const {
    inject: {
        service
    }
} = Ember;

export default Ember.Route.extend({
    session: service(),
    store: Ember.inject.service('store'),
    toast: Ember.inject.service(),
    queryParams: {
        generate: {
            refreshModel: true
        }
    },

    model(params) {
        let brand_id = this.get('session.brand.id');
        let campaign_id = params.campaign_id;

        return Ember.RSVP.hash({
            campaign: this.get("store").findRecord("campaign", campaign_id),
            brand: this.get("store").findRecord("brand", this.get('session.brand.id')),
            postingSchedules: this.get("store").filter("posting-schedule", {
                'brand': brand_id,
            }, function(postingSchedule){
              return postingSchedule.get('posting.campaign.id')==campaign_id;
            }),
            generate: params.generate,
        });
    },
});
