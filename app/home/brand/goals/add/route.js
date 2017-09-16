import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import goalValidations from 'contetto/validations/goal';

const {
  Route,
  get,
  RSVP: { hash }
}  = Ember;

export default Route.extend(AuthenticatedRouteMixin, {
  model() {
    const brand = this.modelFor('brand.edit');
    const { types, statuses, metrics, socialAccounts } = this.modelFor('brand.edit.goals');

    return hash({
      types,
      metrics,
      socialAccounts,
      goalValidations,
      goal: this.store.createRecord('goal', {
        endDate: null,
        value: null,
        type: null,
        metric: null,
        brand: brand,
        status: get(statuses.sortBy('id'), 'firstObject'),
        socialAccount: null
      })
    });
  }
});
