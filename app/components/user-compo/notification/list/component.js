import Ember from 'ember';
import {
  task,
  timeout
}
from 'ember-concurrency';

const {
  Component,
  computed,
  get,
  set
} = Ember;

export default Ember.Component.extend({
  slicedNotifications: [],
  toast: Ember.inject.service('toast'),
  sortDefinition: ['sendTime:desc'],
  sortedNotifications: computed.sort('slicedNotifications', 'sortDefinition'),
  ajax: Ember.inject.service('ajax'),
  store: Ember.inject.service(),
  init() {
    this._super(...arguments);

    set(this, "slicedNotifications", get(this, "notifications").slice(0, 15));
  },

  fakeFetchTask: task(function*() {
    set(this, 'isFetching', true);

    yield timeout(2000);

    set(this, 'isFetching', false);

    var length = get(this, 'slicedNotifications.length');
    get(this, 'slicedNotifications').pushObjects(get(this, 'notifications').slice(length, length + 5)).uniq();
  }),

  actions: {
    deleteAll() {
      var self = this;
      if (confirm("Are you sure you want to delete all your notifications? This cannot be undone.")) {
        this.get("ajax").request('https://gke.contetto.io/notifications/v1/notifications', {
          method: 'DELETE'
        }).then(function() {
          self.get('store').unloadAll('notification');
          self.get('toast').success("Notifications Deleted");
        });
      }
    },
    crossedTheLine(above) {
      var length = get(this, 'slicedNotifications.length');

      if (length === get(this, 'notifications.length')) {
        return;
      }

      get(this, 'fakeFetchTask').perform();
    },

    deleteNotification(notification) {
      get(this, 'slicedNotifications').removeObject(notification);
    }
  }
});
