import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

const BrandSocialAccountRoute = Ember.Route.extend(AuthenticatedRouteMixin, {
	breadCrumb: {
		title: "Social Accounts"
	},
	model() {
		return Ember.RSVP.hash({
			isSocialAccountTabActive: true
		});
	}
});

export default BrandSocialAccountRoute;
