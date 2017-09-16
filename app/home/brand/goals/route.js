import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

const BrandGoal = Ember.Route.extend(AuthenticatedRouteMixin, {
  model () {
    const { brand_id } = this.paramsFor('brand.edit');
    return Ember.RSVP.hash({
      isGoalTabActive: true,
      types: this.store.findAll('goal-type'),
      metrics: this.store.findAll('goal-metric'),
      statuses: this.store.findAll('goal-status'),
      socialAccounts: this.store.query('social-account', { brand: brand_id })
    });
  }
});

export default BrandGoal;
