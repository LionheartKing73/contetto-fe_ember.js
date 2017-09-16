import Ember from 'ember';
import RequireSocialAccount from 'contetto/mixins/require-social-account';

export default Ember.Route.extend(RequireSocialAccount, {
  queryParams: {
    inboxItemId: 0
  },
  session: Ember.inject.service('session'),
  store: Ember.inject.service('store'),
  model(params) {
    const room_id = params.room_id;
    return Ember.RSVP.hash({
      brand: this.get('store').fetchRecord('brand', this.get('session.brand.id')),
      room: this.get('store').findRecord('inboxRoom', room_id),
      highlightItemId: params.inboxItemId
    });
  }
});
