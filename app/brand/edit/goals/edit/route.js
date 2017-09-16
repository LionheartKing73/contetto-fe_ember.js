import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import goalValidations from 'contetto/validations/goal';

const {
  Route,
  RSVP: { hash }
}  = Ember;

export default Route.extend(AuthenticatedRouteMixin, {
  model(params) {
    const { types, metrics, socialAccounts } = this.modelFor('brand.edit.goals');

    return hash({
      types,
      metrics,
      goalValidations,
      socialAccounts,
      goal: this.store.findRecord('goal', params.goal_id)
    });
  }
});
