import Ember from 'ember';

export default Ember.Route.extend({
	model () {
		let comp_id = this.modelFor('home.company').comp_id;
		return Ember.RSVP.hash({
      isInvitesTabActive: true,
      comp_id: comp_id
    });
  }
});
