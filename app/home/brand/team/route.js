import Ember from 'ember';
const BrandTeamRoute = Ember.Route.extend({
  model() {
		var brand = this.modelFor('brand.edit');
    return Ember.RSVP.hash({
			members: brand.get('brandMembers'),
      isTeamTabActive: true,
    });
  }
});
export default BrandTeamRoute;
