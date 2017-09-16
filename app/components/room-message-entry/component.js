import Ember from 'ember';

const {
  Component,
  inject: {
    service
  }
} = Ember;

export default Component.extend({
  websockets: service(),
  session: service(),
  tid: Ember.computed('room', {
    get() {
      return 'fimcb' + this.get('room.id');
    }
  }),
  message: null,
  actions: {
    sendMessage() {
      this.sendAction("sendMessage");
    },
    editLastMessage() {
      this.sendAction("editLastMessage");
    },
    uploadFile(file){
      this.sendAction('uploadFile', file);
    }
  }
});
