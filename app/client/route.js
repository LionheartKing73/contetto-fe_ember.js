import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

const {
  Route,
  inject,
  get,
  set,
  RSVP,
  isArray,
  isEmpty
} = Ember;

export default Route.extend(AuthenticatedRouteMixin, {
  ajax: inject.service(),
  session: inject.service(),

  model(){
    const user = this.modelFor('index');

    // Check if the user is verified. If not, show a screen to resend
    // verification email.
    if (get(user, 'isVerified')) {
      // The user is verified, so check for invitations and redirect accordingly
      return RSVP.allSettled([
        user,
        this.store.findAll('company'),
        this.store.query('invite', { type: 'company', email: get(user, 'email') }),
        this.store.query('invite', { type: 'brand', email: get(user, 'email') })
      ]).then(([ user, companies, companyInvites, brandInvites ]) => {
        return {
          user: user.state === 'fulfilled' ? user.value : null,
          companies: companies.state === 'fulfilled' ? companies.value : null,
          companyInvites: companyInvites.state === 'fulfilled' ? companyInvites.value : null,
          brandInvites: brandInvites.state === 'fulfilled' ? brandInvites.value : null
        };
      });
    } else {
      this.transitionTo('unverified-user');
    }
  },

  afterModel({ user, companies, companyInvites, brandInvites }){
    if ((isArray(brandInvites) && brandInvites.isAny('status', 'waiting')) ||
      (isArray(companyInvites) && companyInvites.isAny('status', 'waiting'))) {
      this.transitionTo('invite');
    } else if (isArray(companies) && !isEmpty(companies.filterBy('isNew', false))) {
      this.transitionTo('company');
    } else {
      this.transitionTo('setup');
    }
  }
});
