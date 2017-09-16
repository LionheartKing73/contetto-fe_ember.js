import Ember from 'ember';
import RequireSocialAccount from 'contetto/mixins/require-social-account';

export default Ember.Route.extend(RequireSocialAccount, {
  breadCrumb: null,
  session: Ember.inject.service('session'),
  store: Ember.inject.service('store'),
  model() {

    return Ember.RSVP.hash({
      /*global moment*/
      brand: this.get('store').fetchRecord('brand', this.get('session.brand.id')),
      fromDate: new Date(moment().subtract(6, "month").utc().set({
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0
      }).format()),
      endDate: new Date(moment().add(1, "day").utc().set({
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0
      }).format()),
      limit: 3000,

      inboxActions: this.get("store").findAll("inboxAction"),
      initialMessages: this.get("store").query("inboxItem", {
        'brand': this.get('session.brand.id'),
        'limit': 3000,
        'fromDate': moment().subtract(6, "month").utc().set({
          hour: 0,
          minute: 0,
          second: 0,
          millisecond: 0
        }).format(),
        'endDate': moment().add(1, "day").utc().set({
          hour: 0,
          minute: 0,
          second: 0,
          millisecond: 0
        }).format()
      })

    });

  }


});
