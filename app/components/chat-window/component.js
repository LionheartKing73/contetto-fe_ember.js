import Ember from 'ember';

const {
  Component,
  get,
  set,
  isEmpty,
  inject: {
    service
  },
  computed,
  isArray
} = Ember;

export default Component.extend({
  store: service('store'),
  session: service(),
  ajax: service('ajax'),
  websockets: service('websockets'),

  editLastMessageWatcher: false,
  hasMoreMessages: true,
  socketRef: null,
  messages: [],
  messageSort: ['date:asc'],
  me: null,

  foundMe: computed('room.users.@each', 'me', function() {
    return this.get("room.users").includes(this.get("me"));
  }),
  sortedMessages: computed.sort('messages', 'messageSort'),
  oldestMessage: computed('sortedMessages.[]', function() {
    return this.get('sortedMessages.firstObject');
  }),
  emptyChat: computed("messages.length", function() {
    return !this.get('messages.length');
  }),
  users: computed(function() {
    let room = get(this, 'room');
    return get(room, 'users');
  }),
  userRooms: computed(function() {
    const currentUserId = this.get('session.data.authenticated.userId');
    const user = this.get('store').findRecord('user', currentUserId);
    return get(user, 'chatRooms');
  }),

  init() {
    this._super(...arguments);
    const _this = this;
    Ember.run.once(this, 'doMoreMessages');
    this.get("store").findRecord("chatRoom", this.get("room.id"));
    this.get("store").fetchRecord("user", this.get("session.data.authenticated.userId")).then((me) => {
      _this.set("me", me);
    });
  },

  didInsertElement() {
    this._super(...arguments);
    $(function() {
      $('[data-toggle=offcanvas]').click(function() {
        $('.row-offcanvas').toggleClass('active');
      });
    });
    var _this = this;
    const socket = this.get('websockets').socketFor('wss://gke.contetto.io/chats/v1/ws/' + this.get('session.data.authenticated.X-Session'));
    socket.on('open', this.myOpenHandler, this);
    socket.on('message', this.myMessageHandler, this);
    socket.on('close', this.myCloseHandler, this);
    this.set('socketRef', socket);
  },

  willDestroyElement() {
    this._super(...arguments);
    const socket = this.get('socketRef');
    socket.off('open', this.myOpenHandler);
    socket.off('message', this.myMessageHandler);
    socket.off('close', this.myCloseHandler);
  },

  didReceiveAttrs() {
    this._super(...arguments);
    if (this.get("chatMessages")) {
      let msgs = [];
      this.get("chatMessages").forEach((m) => {
        msgs.push(m);
      });
      if (this.get("highlightMessage")) {
        msgs.push(this.get("highlightMessage"));
      }
      this.set("messages", Ember.ArrayProxy.create({
        content: msgs
      }));
    }
    const _this = this;
    if (this.get("room.id")) {
      var room = this.get('room');
      var me = this.get('session.data.authenticated.userId');
      this.get('ajax').request('https://gke.contetto.io/chats/v1/lastSeen', {
        data: {
          room: this.get("room.id"),
          user: me
        }
      }).then((ls) => {
        if (ls.data.length == 1) {
          _this.get('store').query('chatMessage', {
            room: _this.get("room.id"),
            gtTime: ls.data[0].attributes.lastSeen
          }).then((messages) => {
            if (messages.get("length") > 0) {
              messages.forEach(function(message) {
                _this.get("messages").addObject(message)
              });
            }
          });
        } else {
          _this.get('store').query('chatMessage', {
            room: _this.get("room.id"),
            size: 20
          }).then((messages) => {
            if (messages.get("length") > 0) {
              messages.forEach(function(message) {
                _this.get("messages").addObject(message)
              });
            }
          });
        }
      });
    }
  },

  myOpenHandler(event) {},

  myMessageHandler(event) {
    const _this = this;
    if (event.data != null && event.data != "") {
      let data = JSON.parse(event.data);
      if (data.room == this.get('room.id')) {
        this.get('store').findRecord('chatMessage', data.messageId).then((message) => {
          _this.get('messages').addObject(message);
        });
      }
    }
  },

  myCloseHandler(event) {
    const socket = this.get('socketRef');
    Ember.run.later(this, () => {
      socket.reconnect();
    }, 1000);
  },

  fetchMentions: function() {
    let re = re = /data-userid="(\w+)"\s/g;
    const str = this.get("taggedMessage");
    const wordList = str.match(re);
    const that = this;
    const mentionsArray = [];
    if (Ember.isPresent(wordList)) {
      wordList.forEach(function(word) {
        let userId = word.replace(re, '$1');
        mentionsArray.push(that.get('store').peekRecord('user', userId));
      });
    }
    return Ember.A(mentionsArray);
  },
  doMoreMessages() {
    const _this = this;
    let lastMessage = this.get('oldestMessage.id');
    if (this.get("room.id")) {
      this.get('store').query('chatMessage', {
        room: this.get("room.id"),
        size: 20,
        lastMessage: lastMessage
      }).then(function(messages) {
        messages.forEach(function(message) {
          _this.get("messages").addObject(message)
        });
        if (messages.get("length") != 20) {
          _this.set("hasMoreMessages", false);
        }
      });
    }
  },

  actions: {
    joinRoom(room) {
      var component = this;
      this.get('store').fetchRecord('chatRoom', room.get('id')).then((r) => {
        if (r.get("private") === false) {
          var me = this.get("session.data.authenticated.userId");
          component.get('store').fetchRecord('user', me).then((meObj) => {
            r.get("users").addObject(meObj);
            r.save();
          });
        } else {
          alert("Sorry, you do not have permission to join this private room.");
        }
      });
    },
    moreMessages() {
      this.doMoreMessages();
    },
    uploadFile(file) {
      const socket = this.get('socketRef');
      socket.send(JSON.stringify({
        "action": "POST",
        "session": this.get('session.data.authenticated.X-Session'),
        "room": this.get('room.id'),
        "attachments": [file.get('id')]
      }));
    },
    sendMessage() {
      const mentions = this.fetchMentions();
      const socket = this.get('socketRef');
      socket.send(JSON.stringify({
        "action": "POST",
        "session": this.get('session.data.authenticated.X-Session'),
        "room": this.get('room.id'),
        "message": this.get('taggedMessage'),
        "mentions": mentions.map((mention) => {
          return mention.get("id");
        })
      }));
      this.set("message", null);
      this.set("taggedMessage", null);
    },
    editLastMessage: function() {
      this.toggleProperty("editLastMessageWatcher");
    },
    updateMessage(message) {
      const socket = this.get('socketRef');
      socket.send(JSON.stringify({
        "action": 'PATCH',
        "messageId": message.get("id"),
        "session": this.get('session.data.authenticated.X-Session'),
        "room": this.get('room.id'),
        "pinned": message.get('pinned'),
        "checked": message.get('checked'),
        "message": message.get('message'),
        "mentions": message.get("mentions").map((mention) => {
          return mention.get("id");
        })
      }));
    },
    leaveRoom() {
      if (confirm("Are you sure that you want to leave this room?")) {
        var me = this.get('session.data.authenticated.userId');
        this.get('store').fetchRecord('user', me).then((meObj) => {
          this.get('room.users').removeObject(meObj)
          this.get('room').save().then((room) => {
            console.log("Hmmmm");
          })
        });
      }
    }
  }
});
