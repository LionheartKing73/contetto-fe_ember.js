import Ember from 'ember';

export default Ember.Component.extend({
    store: Ember.inject.service('store'),
    session: Ember.inject.service(),
    websockets: Ember.inject.service('websockets'),
    tid: Ember.computed('room', {get() {
            return 'fimc' + this.get('room.id');
        }
    }),
    latestMessageId: Ember.computed('sortedMessages.length', 'sortedMessages.@each.id', function(){
      let latestMessageId = null;
      for(var i=this.get("sortedMessages.length")-1;i>=0;i--){
        let currentMessage = this.get("sortedMessages")[i];
        if(currentMessage.get("user.id")==this.get('session.data.authenticated.userId')){
          latestMessageId = currentMessage.get("id");
          break;
        }
      }
      return latestMessageId;
    }),
    hasMoreMessages: true,
    didReceiveAttrs() {
        this._super(...arguments);

        const _this = this;
        // GET to /persons?filter[name]=Peter
        this.set('messages', []);
        if (this.room) {
            //     console.log('a');
            var room = this.get('room')


            _this.get('store').query('chatMessage', {
                room: room.id,
                size: 5
            }).then((messages) => {
                //    console.log('c');
                messages.forEach(function(message) {
                    _this.get('messages').addObject(message);

                });
                Ember.run.next(_this, function(){
                  this.scrollMC(this.get("room.id"));
                })
            });

        }
    },
    scrollMC: function(room) {
      const timeArr = [100, 500,1000];
      timeArr.forEach(function(time){
        setTimeout(function(){
          $("#microchat_" + room).find("div.micro_chat_area").scrollTop($("#microchat_" + room).find("div.micro_chat_area").prop("scrollHeight"));
        }, time);
      });
    },
    socketRef: null,
    messages: [],
    microchat: Ember.inject.service('microchat'),
    messageSort: ['date:asc'],
    sortedMessages: Ember.computed.sort('messages', 'messageSort'),
    emptyChat: Ember.computed("messages.length", function(){
      return !this.get('messages.length');
    }),
    oldestMessage: function() {
        return this.get('sortedMessages.firstObject'); // or this.get('model.firstObject');
    }.property('sortedMessages.[]'),
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
    didInsertElement() {
        /*global $*/
        $(function() {
            $('[data-toggle=offcanvas]').click(function() {
                $('.row-offcanvas').toggleClass('active');
            });
        });

        // var mci = 0;
        // $(".mc_window").each(function() {
        //     var ml = mci * 225;
        //     ml = ml - 40;
        //     $(this).css('margin-left', ml);
        //     mci++;
        // });
        this.scrollMC(this.get('room.id'));
        this._super(...arguments);
        /*
          2. The next step you need to do is to create your actual websocket. Calling socketFor
          will retrieve a cached websocket if one exists or in this case it
          will create a new one for us.
        */
        //  console.log('sA' + 'wss://gke.contetto.io/chats/v1/ws/' + this.get('session.data.authenticated.X-Session'));
        const socket = this.get('websockets').socketFor('wss://gke.contetto.io/chats/v1/ws/' + this.get('session.data.authenticated.X-Session'));
        //console.log("sB");
        /*
          3. The next step is to define your event handlers. All event handlers
          are added via the `on` method and take 3 arguments: event name, callback
          function, and the context in which to invoke the callback. All 3 arguments
          are required.
        */
        socket.on('open', this.myOpenHandler, this);
        socket.on('message', this.myMessageHandler, this);
        socket.on('close', this.myCloseHandler, this);

        this.set('socketRef', socket);
    },

    willDestroyElement() {
        this._super(...arguments);

        const socket = this.get('socketRef');

        /*
          4. The final step is to remove all of the listeners you have setup.
        */
        socket.off('open', this.myOpenHandler);
        socket.off('message', this.myMessageHandler);
        socket.off('close', this.myCloseHandler);
    },

    myOpenHandler(event) {
        //    console.log(`On open event has been called: ${event}`);
    },

    myMessageHandler(event) {
        const _this = this;
        if (event.data != null && event.data != "") {
            let data = JSON.parse(event.data);
            if (data.room == this.get('room.id')) {
                //         console.log("Message: " + data.messageId + " should be added to this room");
                this.get('store').findRecord('chatMessage', data.messageId).then((message) => {
                    _this.get('messages').addObject(message);

                    _this.get("microchat").handleSeen(data.room);

                    this.scrollMC(this.get('room.id'));

                });
            }
            //  console.log(`Message: ${event.data}`);
        }
    },

    myCloseHandler(event) {
        //  console.log(`On close event has been called: ${event}`);
        const socket = this.get('socketRef');
        //.socketFor('wss://gke.contetto.io/chats/v1/ws/'+this.get('session.data.authenticated.X-Session'));
        Ember.run.later(this, () => {
            /*
              This will remove the old socket and try and connect to a new one on the same url.
              NOTE: that this does not need to be in a Ember.run.later this is just an example on
              how to reconnect every second.
            */
            socket.reconnect();
        }, 1000);
    },


    actions: {
        editLastMessage() {
          this.set("isEditing", true);
        },
        closeRoom() {
            this.get('closeAction')(this.get('room.id'));
        },
        launchRoom() {
            this.get('closeAction')(this.get('room.id'));
            this.get('router').transitionTo('brand.edit.chat.details', this.get('room.brand.id'), this.get('room.id'));
        },
        moreMsgs() {
            const _this = this;
            let lastMessage = this.get('oldestMessage.id');
            //   console.log("MC-a: " + lastMessage);


            this.get('store').query('chatMessage', {
                room: this.get('room.id'),
                size: 5,
                lastMessage: lastMessage
            }).then((messages) => {
                if(messages.get("length")>0){
                  messages.forEach(function(message) {
                    _this.get('messages').addObject(message);
                  });
                }
                else{
                  _this.set("hasMoreMessages", false);
                }
            });
        },

        sendMessage() {
            //     alert("Message: "+this.get("message")+" Room: "+this.get('room.id')+" Session: "+this.get('session.data.authenticated.X-Session'));
            const mentions = this.fetchMentions();
            // const userId = this.get('session.data.authenticated.userId');
            // let chatMessage = this.get('store').createRecord('chat-message', {
            //     message: this.get('taggedMessage'),
            //     room: this.get('room')
            // });
            // mentions.forEach(function(mention) {
            //     chatMessage.get('mentions').addObject(mention);
            // });
            const socket = this.get('socketRef');
            socket.send(JSON.stringify({
              "action": 'POST',
              "session": this.get('session.data.authenticated.X-Session'),
              "room": this.get('room.id'),
              "message": this.get('taggedMessage'),
              "mentions": mentions.map((mention)=> {return mention.get("id");} )
            }));
            this.set("message", null);
            this.set("taggedMessage", null);
            this.scrollMC(this.get('room.id'));
            this.get("microchat").handleSeen(this.get('room.id'));
        },
        uploadFile(file){
          const socket = this.get('socketRef');
          socket.send(JSON.stringify({
            "action": "POST",
            "session": this.get('session.data.authenticated.X-Session'),
            "room": this.get('room.id'),
            "attachments": [file.get('id')]
          }));
        },
        sendMessageAlt() {
            const mentions = this.fetchMentions();
            const userId = this.get('session.data.authenticated.userId');
            const _this = this;
            let chatMessage = this.get('store').createRecord('chat-message', {
                message: this.get('taggedMessage'),
                room: this.get('room')
            });
            mentions.forEach(function(mention) {
                chatMessage.get('mentions').addObject(mention);
            });
            chatMessage.set('user', this.get('store').peekRecord('user', userId));
            chatMessage.save().then(function(message) {
                _this.set("message", null);
                _this.set("taggedMessage", null);
                console.log(message);
                _this.get('messages').addObject(message);
                _this.get("microchat").handleSeen(message.get('room.id'));
                _this.scrollMC(message.get('room.id'));
            });
        },
        updateMessage(message) {
            const socket = this.get('socketRef');
            socket.send(JSON.stringify({
              "action": 'PATCH',
              "session": this.get('session.data.authenticated.X-Session'),
              messageId: message.get("id"),
              "room": this.get('room.id'),
              "pinned": message.get('pinned'),
              "checked": message.get('checked'),
              "message": message.get('message'),
              "mentions": message.get("mentions").map((mention)=> {return mention.get("id");} )
            }));
        },
    }
});
