import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

const BrandTeamDeptRoute = Ember.Route.extend(AuthenticatedRouteMixin, {
	model () {
    		return Ember.RSVP.hash({
      			isTeamDeptActive: true,
            member: this.modelFor('brand.edit.team.user').user
    		});
  	}
});

export default BrandTeamDeptRoute;
