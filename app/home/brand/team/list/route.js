import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

const TeamListRoute = Ember.Route.extend(AuthenticatedRouteMixin, {
  model() {
    return Ember.RSVP.hash({
      isTeamUsersActive: true,
      members: this.modelFor('brand.edit.team').members
    });
  },

  actions: {
    deleteMember(memberId) {
      var confirm = window.confirm('Do you want to delete member');
      if (confirm) {
        var memberExist = this.store.peekRecord('brand-member', memberId);
        if (memberExist) {
          memberExist.destroyRecord();
        }
      }
    }
  }
});

export default TeamListRoute;
