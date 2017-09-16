import Ember from 'ember';
import DS from 'ember-data';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

const { inject: { service }, set } = Ember;

const AccountsSocialRoute = Ember.Route.extend(AuthenticatedRouteMixin, {
  session: service('session'),

  model() {
    const brandId = this.paramsFor('brand.edit').brand_id;
    const brand = this.store.peekRecord('brand', brandId);

    return Ember.Object.create({
      account: this.store.createRecord('social-account', {
        brand: brand
      }),
      brandId: brandId,
      errors: DS.Errors.create(),
      isSubmitted: false,
      page: false,
      type: 'profile'
    });
  },

  actions: {
    willTransition() {
      set(this.currentModel, 'page', false);
      set(this.currentModel, 'type', 'profile');

      if (this.currentModel.account.get('hasDirtyAttributes')) {
        this.currentModel.account.rollbackAttributes();
      }
    }
  }
});

export default AccountsSocialRoute;
