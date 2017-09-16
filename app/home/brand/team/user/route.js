import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    return Ember.RSVP.hash({
      user: this.modelFor('brand.edit.team').members.findBy('id', params.memberId)
    });
  },

});
