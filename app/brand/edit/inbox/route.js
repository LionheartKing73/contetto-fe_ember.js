import Ember from 'ember';
import RequireSocialAccount from 'contetto/mixins/require-social-account';
import BrandAuthorization from 'contetto/mixins/brand-authorization';

const {
  Route
} = Ember;

export default Route.extend(RequireSocialAccount, BrandAuthorization, {
  authorizationAttribute: 'viewInbox',
  authorizationFailedRoute: 'brand.edit.dashboard',
});
