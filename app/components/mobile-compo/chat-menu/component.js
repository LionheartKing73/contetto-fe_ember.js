import Ember from 'ember';

const {
  Component,
  get, set,
  computed,
  inject: { service }
} = Ember;

export default Component.extend({
  store: service(),

  rooms: [],
  roomSort: ['name:asc'],

  sortedRooms: computed.sort('rooms', 'roomSort'),

  didReceiveAttrs () {
    if (!this.get("brand")) {
      return;
    }

    get(this, 'brand').get('chatRooms').then((rooms) => {
      this.set('rooms', rooms);
    });
  }

});
