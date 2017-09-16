import Ember from 'ember';
import moment from 'moment';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

const {
  inject: {
    service
  }
} = Ember;


const BrandCampaignListRoute = Ember.Route.extend(AuthenticatedRouteMixin, {
  session: service(),
  store: Ember.inject.service('store'),
  model() {
    let _this = this;
    let brandId = this.get('session.brand.id');



    return Ember.RSVP.hash({
      brand: this.get("store").fetchRecord("brand", brandId),
      campaigns: this.get("store").query("campaign", {
        'brand': brandId
      })

    });
  }


});

export default BrandCampaignListRoute;
