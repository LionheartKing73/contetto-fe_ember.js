import Ember from 'ember';

const {
  inject: {
    service
  }
} = Ember;

export default Ember.Route.extend({
  toast: service(),

  model() {
    const brandId = this.paramsFor('brand.edit').brand_id;

    return Ember.RSVP.hash({
      invites: this.store.query('invite', { brand: brandId, status: 'waiting' })
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
