import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

const TeamListRoute = Ember.Route.extend(AuthenticatedRouteMixin, {
  toast: Ember.inject.service(),

  model() {
    return Ember.RSVP.hash({
      isTeamUsersActive: true,
      brand: this.modelFor('brand.edit'),
      members: this.modelFor('brand.edit.team').members
    });
  },

  actions: {
    deleteMember(memberId) {
      const member = this.store.peekRecord('brand-member', memberId);

      if (!member) {
        return;
      }

      if (this.currentModel.brand.get('contentManager.id') === member.get('user.id')) {
        return this.get('toast').error('This user seems to the content manager for the current brand. Please set a different content manager to be able to remove this user.');
      }

      var confirm = window.confirm('Do you want to delete member');
      if (confirm) {
        member.destroyRecord();
      }
    }
  }
});

export default TeamListRoute;
