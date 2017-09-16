import Ember from 'ember';
import BrandAuthorization from 'contetto/mixins/brand-authorization';

const {
  Route,
  inject: {
    service
  }
} = Ember;

export default Route.extend(BrandAuthorization, {
  toast: service(),
  authorizationAttribute: 'manageTeam',

  model() {
    const brandId = this.paramsFor('brand.edit').brand_id;

    return Ember.RSVP.hash({
      invites: this.store.query('invite', { brand: brandId, status: 'waiting' })
    });
  },

  actions: {
    cancelInvite(invite) {
      if (this.canAllowBrandAccess('manageSocialAccounts') && confirm('Do you want to delete invite?')) {
        invite.destroyRecord().then(() => {
          this.get('toast').success("Successfully removed the invite!");
        });
      }
    }
  }
});
