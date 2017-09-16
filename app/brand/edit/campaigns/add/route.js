import Ember from 'ember';
import DS from 'ember-data';
import moment from 'moment';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

const {
	inject: {
		service
	}
} = Ember;

const BrandCampaignAddRoute = Ember.Route.extend(AuthenticatedRouteMixin, {
	session: service(),
	store: Ember.inject.service('store'),
	toast: Ember.inject.service(),

	model() {
		let brand_id = this.get('session.brand.id');
		return Ember.RSVP.hash({
			campaign: this.get("store").createRecord("campaign"),
			brand: this.get("store").findRecord("brand", this.get('session.brand.id')),
			goals: this.get('store').findAll('campaignGoal'),
			products: this.get('store').query("product", {
				'brand': brand_id
			})
		});
	},

});

export default BrandCampaignAddRoute;
