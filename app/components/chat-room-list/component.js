import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['chat-room-list'],
  session: Ember.inject.service(),
  store: Ember.inject.service('store'),
  roomSort: ['latestMessageTime:asc'],
  sortedRooms: Ember.computed.sort('rooms', 'roomSort'),
  didReceiveAttrs() {
    this.get("rooms").forEach((room) => {
      room.set('latestMessageTime', this.get("store").peekAll("chatMessage").filter((chatMessage) => {
        return chatMessage.get("room.id") == room.get("id");
      }).sortBy('date').get('lastObject.date'));
    });
  },
  actions: {}
});
