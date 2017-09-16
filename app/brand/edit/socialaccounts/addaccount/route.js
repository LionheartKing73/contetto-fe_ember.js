import Ember from 'ember';
import BrandAuthorization from 'contetto/mixins/brand-authorization';

const {
  Route
} = Ember;

export default Route.extend(BrandAuthorization, {
  authorizationAttribute: 'manageSocialAccounts',
  authorizationFailedRoute: 'brand.edit.socialaccounts'
});
