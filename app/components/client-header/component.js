import Ember from 'ember';
import DS from 'ember-data';

const {
  Component,
  get,
  set,
  computed,
  inject: {
    service
  }
} = Ember;

export default Ember.Component.extend({
  session: service(),
  sideMenu: service(),

  brand: computed.readOnly('session.brand'),

  unseenNotificationCount: null,

  unseenBrandChatCount: computed('brand', function() {
    const unseenCount = Ember.getOwner(this).lookup('utils:unseen-count');
    const userId = get(this, 'session.data.authenticated.userId');
    const brandId = get(this, 'brand.id');

    if (!brandId) {
      return 0;
    }

    return DS.PromiseObject.create({
      promise: unseenCount.getUnseenBrandChatCount(userId, brandId).then((res) => {
        return res.data.attributes.count;
      })
    });
  }),

  didReceiveAttrs() {
    const unseenCount = Ember.getOwner(this).lookup('utils:unseen-count');
    const userId = get(this, 'session.data.authenticated.userId');

    unseenCount.getUnseenNotificationsCount(userId).then((res) => {
      set(this, 'unseenNotificationCount', res.data.attributes.count);
    });
  },

  actions: {
    dndSwitch(state) {
      if (state) {

        this.set("user.dnd", 1);
      }
      else {

        this.set("user.dnd", 0);
      }
      this.get("user").save();
    },
    openNotifications() {
      set(this, 'session.isMobileChatOpen', false);
      set(this, 'session.isMobileNotificaitonOpen', true);
      get(this, 'sideMenu').open();
    },

    openChats() {
      set(this, 'session.isMobileNotificaitonOpen', false);
      set(this, 'session.isMobileChatOpen', true);
      get(this, 'sideMenu').open();
    },

    openBurgerMenu() {
      set(this, 'session.isMobileNotificaitonOpen', false);
      set(this, 'session.isMobileChatOpen', false);
      get(this, 'sideMenu').open();
    }
  }
});
