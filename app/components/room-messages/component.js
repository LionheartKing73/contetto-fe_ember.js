import Ember from 'ember';

const {
  Component,
  inject: {
    service
  }
} = Ember;

export default Component.extend({
  store: service('store'),
  session: service(),
  isEditing: false,
  pinnedOptions: ["Pinned", "Unpinned"],
  selectedPinnedOptions: ["Pinned", "Unpinned"],
  checkedOptions: ["Checked", "Unchecked"],
  selectedCheckedOptions: ["Checked", "Unchecked"],
  pinBool: true,
  unpinBool: true,
  checkBool: true,
  uncheckBool: true,
  didInsertElement() {
    var component = this;
    let lastMessage = this.get('oldestMessage.id');
    // console.log("mm2");
    var room = this.get('room');
  },
  latestMessageId: Ember.computed('sortedMessages.length', 'sortedMessages.@each.id', function() {
    let latestMessageId = null;
    for (var i = this.get("sortedMessages.length") - 1; i >= 0; i--) {
      let currentMessage = this.get("sortedMessages")[i];
      if (currentMessage.get("user.id") == this.get('session.data.authenticated.userId')) {
        latestMessageId = currentMessage.get("id");
        break;
      }
    }
    return latestMessageId;
  }),
  editLastMessage: Ember.observer('editLastMessageWatcher', function() {
    this.set("isEditing", true);
  }),

  didRender() {
    /*global $*/
    $("div.chat_area").scrollTop($(".chat_area").prop('scrollHeight'));
  },

  displayMessages: Ember.computed('sortedMessages.@each.id', 'pinBool', 'unpinBool', 'checkBool', 'uncheckBool', function() {
    var pinBool = this.get('pinBool');
    var unpinBool = this.get('unpinBool');
    var checkBool = this.get('checkBool');
    var uncheckBool = this.get('uncheckBool');
    return this.get('sortedMessages').filter((message) => {
      return ((pinBool && message.get('pinned')) || (unpinBool && !message.get('pinned')));
    }).filter((message) => {
      return ((checkBool && message.get('checked')) || (uncheckBool && !message.get('checked')));
    });
  }),
  actions: {
    moreMessages() {
      this.sendAction('moreMessages');
    },
    updateMessage(message) {
      this.sendAction('updateMessage', message);
    },
    leaveRoom() {
      this.sendAction('leaveRoom');
    },
    updatePinSelection(newSelection) {
      this.set('selectedPinnedOptions', newSelection);
      var pinBool = this.get('selectedPinnedOptions').indexOf('Pinned') > -1;
      this.set('pinBool', pinBool);
      var unpinBool = this.get('selectedPinnedOptions').indexOf('Unpinned') > -1;
      this.set('unpinBool', unpinBool);
    },
    updateCheckSelection(newSelection) {
      this.set('selectedCheckedOptions', newSelection);
      var checkBool = this.get('selectedCheckedOptions').indexOf('Checked') > -1;
      this.set('checkBool', checkBool);
      var uncheckBool = this.get('selectedCheckedOptions').indexOf('Unchecked') > -1;
      this.set('uncheckBool', uncheckBool);
    }
  }
});
