import Ember from 'ember';
import RequireSocialAccount from 'contetto/mixins/require-social-account';

const {
  Route,
  inject: { service },
  RSVP: { hash }
} = Ember;

export default Route.extend(RequireSocialAccount, {
  session: service(),

  model() {
    return hash({
      brand: this.store.findRecord('brand', this.get('session.brand.id')),
      fromDate: new Date(moment().utc().format()),
      endDate: new Date(moment().add(1, 'month').utc().format())
    });
  }
});
