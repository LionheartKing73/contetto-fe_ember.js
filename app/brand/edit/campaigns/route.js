import Ember from 'ember';
import RequireSocialAccount from 'contetto/mixins/require-social-account';

const {
  Route,
  inject
} = Ember;

export default Route.extend(RequireSocialAccount, {
  session: inject.service(),
  breadCrumb: {
    title: "Campaigns",
    linkable: true
  },
  model() {
    return Ember.RSVP.hash({
      brand_id: this.get('session.brand.id')
    });
  }
});
