import Ember from 'ember';
import DS from 'ember-data';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

const {
  inject: {service}
} = Ember;

const CampaignPostsRoute = Ember.Route.extend(AuthenticatedRouteMixin, {
  session: service(),

	toast: service(),

	model() {
    let brand_id = this.get('session.brand.id');

  	return Ember.RSVP.hash({
  		currDate: new Date(),
      isPostsTabActive: true,
      posts:this.store.query('posting', { brand: brand_id }),
      filters:Ember.Object.create({isApproved:'',
        type:'',
        startdD:'',
        endD:''
      }),
  		errors: DS.Errors.create(),
  	    data: Ember.Object.create({
          isSubmitted: false
      })
    });
	}
});

export default CampaignPostsRoute;
