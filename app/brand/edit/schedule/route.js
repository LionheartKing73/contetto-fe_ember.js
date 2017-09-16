import Ember from 'ember';
import RequireSocialAccount from 'contetto/mixins/require-social-account';

const {
  Route,
  inject: {
    service
  },
  RSVP: {
    hash
  }
} = Ember;

export default Route.extend(RequireSocialAccount, {
  session: service(),
  model(params) {
    if (params.userId) {
      var user = this.store.findRecord('user', params.userId);
    }
    return hash({
      brand: this.store.findRecord('brand', this.get('session.brand.id')),
      user: user
    });
  }
});
