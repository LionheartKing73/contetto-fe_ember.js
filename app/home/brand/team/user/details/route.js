import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

const TeamDetailsRoute = Ember.Route.extend(AuthenticatedRouteMixin, {
	model () {
		return Ember.RSVP.hash({
  			isTeamDetailsActive: true,
        member: this.modelFor('brand.edit.team.user').user
		});
  	}
});

export default TeamDetailsRoute;
