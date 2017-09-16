import Ember from 'ember';

const {
  Component,
  get, set,
  inject: { service }
} = Ember;

export default Ember.Component.extend({
  session: service(),
  tagName: 'li',
  unreadCount: null,

  didReceiveAttrs() {
    const unseenCount = Ember.getOwner(this).lookup('utils:unseen-count');
    const userId = get(this, 'session.data.authenticated.userId');
    const roomId = get(this, 'room.id');

    unseenCount.getUnseenRoomChatCount(userId, roomId).then((res) => {
      set(this, 'unreadCount', res.data.attributes.count);
    });
  }
});
