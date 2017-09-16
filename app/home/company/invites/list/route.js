import Ember from 'ember';

const {
  inject: {
    service
  }
} = Ember;

export default Ember.Route.extend({
  toast: service(),

  model() {
    let company = this.modelFor('home.company').company;

    return Ember.RSVP.hash({
      company: company,
      invites: this.store.query('company-invite', { company: company.get('id'), status: 'waiting' })
    });
  },

  actions: {
    cancelInvite(invite) {
      var confirm = window.confirm('Do you want to delete invite?');
      if (confirm) {
        invite.destroyRecord().then(() => {
          this.get('toast').success("Successfully removed the invite!");
        });
      }
    }
  }
});
