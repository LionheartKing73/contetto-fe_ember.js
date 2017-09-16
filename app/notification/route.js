import Ember from 'ember';

export default Ember.Route.extend({
  session: Ember.inject.service(),
  model(params) {
    let notification = this.get("store").findRecord("notification", params.notification_id);
    return Ember.RSVP.hash({
      notification,
      user: notification.get("user")
    });
  },
  afterModel(model) {
    let notification = model.notification;
    let user = model.user;
    const self = this;
    if (user.get("id") != this.get('session.data.authenticated.userId')) {
      if (alert("Please sign in with the appropriate account to view this notification")) {
        this.transitionTo("index");
      }
    }
    else if (notification.get("actionType") == "posting") {
      this.get("store").findRecord("posting", notification.get("actionId")).then((p) => {
        self.get("quickpost").editPost(p);
      });
    }
    else if (notification.get("actionType") == "room") {
      this.get("router").transitionTo("brand.edit.chat.details", notification.get("brand.company.id"), notification.get("brand.id"), notification.get("actionId"));
    }
    else if (notification.get("actionType") == "message") {
      self.get("store").findRecord("chat-message", notification.get("actionId")).then(function(message) {
        self.get("router").transitionTo('/companies/' + message.get('room.brand.company.id') + '/brand/' + message.get('room.brand.id') + '/chat/' + message.get('room.id') + '?chatMessageId=' + message.get('id'));
      });
    }
    else if (notification.get("actionType") == "inboxItem") {
      self.get("notification.brand").then(function(brand) {
        self.get("store").findRecord("inboxItem", notification.get("actionId")).then((inboxItem) => {
          self.get("router").transitionTo('/companies/' + brand.get('company.id') + '/brand/' + brand.get('id') + '/inbox/' + inboxItem.get('room.id') + '/room' + '?inboxItemId=' + inboxItem.get('id'));
        });
      });
    }
    else if (!notification.get("actionType")) {
      this.transitionTo("user.notification");
    }
  }
});
