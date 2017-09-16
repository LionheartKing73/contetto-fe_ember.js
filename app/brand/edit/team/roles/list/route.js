import Ember from 'ember';
import BrandAuthorization from 'contetto/mixins/brand-authorization';

const {
  Route,
  get
}= Ember;

export default Route.extend(BrandAuthorization, {
  authorizationAttribute: 'manageTeam',

  model() {
    const brandId = this.paramsFor('brand.edit').brand_id;

    return Ember.RSVP.hash({
      roles: this.store.query('brand-role', {id: brandId})
    });
  },

  actions: {
    removeRole(roleId) {
      const role = this.store.peekRecord('brand-role', roleId);

      if (this.canAllowBrandAccess('manageTeam') && confirm('Are you sure you want to delete the role ' + get(role, 'name') + ' ?')) {
        role.destroyRecord();
      }
    }
  }

});
