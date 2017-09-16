import Ember from 'ember';
import RSVP from 'rsvp';
import Visibility from "npm:visibilityjs";

const {
  computed,
  get,
  set,
  ObjectProxy,
  PromiseProxyMixin
} = Ember;

const ObjectPromiseProxy = ObjectProxy.extend(PromiseProxyMixin);

export default Ember.Component.extend({

  init() {
    this._super();
    this.set("ctl", false);
    var self = this;
    Ember.run.later(function() {
      self.checkVis();
    }, 1000);
  },
  ctl: false,
  session: Ember.inject.service('session'),
  logoLoaded: false,
  quickpost: Ember.inject.service('quickpost'),
  store: Ember.inject.service('store'),
  logoCheck: computed.and('logoSrc.isFulfilled', 'logoLoaded'),
  logoPromise: computed('notification.brand.logo', {
    get() {
      let toReturn;
      const logo = get(this, 'notification.brand.logo');
      if (!logo) {
        toReturn = RSVP.reject();
      }
      else {
        toReturn = new RSVP.Promise((resolve, reject) => {
          var img = new Image();
          img.onload = () => {
            resolve(logo);
          };
          img.onerror = () => {
            reject(logo);
          };
          img.src = logo;
        });
      }
      return ObjectPromiseProxy.create({
        promise: toReturn
      });
    }
  }),
  logoSrc: computed('logoPromise.isFulfilled', {
    get() {
      const logoPromise = get(this, 'logoPromise');
      if (get(logoPromise, 'isFulfilled')) {
        set(this, 'logoLoaded', true);
      }
      return logoPromise;
    }
  }),
  seenclass: computed('notification.seen', {
    get() {
      if (this.get("notification.seen")) {
        return "seen";
      }
      else {
        return "unseen";
      }
    }
  }),
  checkVis() {
    var checkAgain = true;
    var self = this;
    if (!this.get('notification.seen')) {
      if (!Visibility.hidden()) {
        if ($('#notificationRow_' + this.get("notification.id")).is(':visible')) {
          if (this.get("ctl")) {
            //     console.log("Visible: " + this.get("notification.id"));
            this.set("notification.seen", true);
            this.get("notification").save();
            checkAgain = false;
            // console.log("Set seen " + this.get("notification.id"));
          }
          else {
            //  console.log("Scroll lock...");
          }
        }
        else {
          //   console.log("Div hidden...");
        }
      }
      else {
        //   console.log("Page hidden...");
      }
    }
    else {
      //  console.log("Already visible...");
      checkAgain = false;
    }
    if (checkAgain) {
      Ember.run.later(function() {
        self.checkVis();
      }, 10000);
    }
  },
  actions: {
    handled(notification) {
      notification.set("handled", true);
      notification.save();
    },
    crossedTheLine(above) {
      // do lots of cool stuff
      this.set("ctl", true);
    },
    notificationLink(notification) {
      var self = this;
      if (notification.get("user.id") != this.get('session.data.authenticated.userId')) {
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
  }

});
