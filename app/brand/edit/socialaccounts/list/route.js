import Ember from 'ember';
import BrandAuthorization from 'contetto/mixins/brand-authorization';

const {
  Route,
  get, set,
  inject: { service }
} = Ember;

export default Route.extend(BrandAuthorization, {
  session: service(),
  authorizationAttribute: 'manageSocialAccounts',

  model() {
    const { brand_id } = this.paramsFor('brand.edit');
    return this.store.query('social-account', { brand: brand_id });
  },
});
