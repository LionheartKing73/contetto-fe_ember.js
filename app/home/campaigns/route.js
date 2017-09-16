import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

const {
  inject: {service}
} = Ember;


const CampaignRoute = Ember.Route.extend(AuthenticatedRouteMixin, {
  companyDetail: service('current-company'),

  beforeModel(transition) {
    Ember.setProperties(transition.resolvedModels.home, {
      '_isTopMenuOpened': false,
      '_isInboxNavMenuHide': true,
      '_isRightSideMenuOpened': false,
      '_isLeftSideMenuOpened': false,
      '_isRightFilterMenuHide': true
    });
  },

  model() {
    let brand_id = this.get('companyDetail.data.brandId');

    return Ember.RSVP.hash({
       brand_id: brand_id
    });
  }
});

export default CampaignRoute;
