import Ember from 'ember';

const {
  inject: {
    service
  }
} = Ember;

export default Ember.Route.extend({
  session: service(),
  toast: service(),

  model() {
    const userId = this.get('session.data.authenticated.userId');

    return Ember.RSVP.hash({
      invites: this.store.query('invite', { user: userId, type : 'company' })
    });
  },

  actions: {
    acceptInvite(invite) {
      let companyMember = this.store.createRecord('companyMember', {
        type: 'companyMember',
        role: invite.get('role'),
        user: invite.get('user'),
        company: invite.get('company')
      });

      invite.set('status', 'accept');

      invite.save().then(() => {
        companyMember.save().then(() => {
          this.get('toast').success('You have been added as member successfully');
        });
        this.get('toast').success('You have accepted request successfully');
      });
    },
    rejectInvite(invite) {
      invite.set('status', 'reject');
      invite.save().then(() => {
        this.get('toast').success('You have rejected request successfully');
      });
    }
  }
});
