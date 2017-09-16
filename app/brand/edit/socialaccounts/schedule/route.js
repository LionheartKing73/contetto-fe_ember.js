import Ember from 'ember';
import BrandAuthorization from 'contetto/mixins/brand-authorization';

const {
  Route,
  RSVP: {
    hash
  }
} = Ember;

export default Route.extend(BrandAuthorization, {
  authorizationAttribute: 'manageSocialAccounts',
  authorizationFailedRoute: 'brand.edit.socialaccounts',

  model(params) {
    return hash({
      account: this.get('store').findRecord('socialAccount', params.accountId),
      general: this.get('store').findRecord('networkType', 1),
      sales: this.get('store').findRecord('networkType', 2)
    });
  }
});
