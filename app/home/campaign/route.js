import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

const {
  inject: {service}
} = Ember;

const CampaignsRoute = Ember.Route.extend(AuthenticatedRouteMixin, {
  companyDetail: service('current-company'),

  model(param) {
    let brand_id = this.get('companyDetail.data.brandId');

    return Ember.RSVP.hash({
       camp_id: param.camp_id,
       brand_id: brand_id
    });
  }
});

export default CampaignsRoute;
