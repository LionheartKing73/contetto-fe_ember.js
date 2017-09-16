import Ember from 'ember';
import BrandAuthorization from 'contetto/mixins/brand-authorization';

const {
  Route,
  RSVP: { hash }
} = Ember;

export default Route.extend(BrandAuthorization, {
  authorizationAttribute: 'manageTeam',

  model () {
    const brand = this.modelFor('brand.edit');
    const brandMember = this.modelFor('brand.edit.team.user');

    return hash({
      brandMember,
      member: brandMember.get('user'),
      brand,
      brandRole: brandMember.get('brandRole')
    });
  }
});
