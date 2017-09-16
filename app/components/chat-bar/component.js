import Ember from 'ember';

export default Ember.Component.extend({
  session: Ember.inject.service(),
  store: Ember.inject.service('store'),
  microchat: Ember.inject.service('microchat'),
  rooms: [],
  roomSort: ['name:asc'],
  sid: null,
  cid: null,
  extraChatList: false,
  sortedRooms: Ember.computed.sort('rooms', 'roomSort'),
  roomUpdate: Ember.computed('session.company.id', 'session.brand.id', {
    get() {
      var component = this;
      if (this.get("session.company.id") != this.get("cid")) {
        this.set("cid", this.get("session.company.id"));
      }
      if (this.get("session.brand.id") != this.get("sid")) {


        this.set("sid", this.get("session.brand.id"));
        if (this.get("session.brand.id") != null && this.get("session.brand.id") != "" && this.get("session.brand.id") !== false) {


          this.get('store').fetchRecord('brand', this.get('session.brand.id')).then((brand) => {
            var rooms = [];
            //     console.log('toMap');
            brand.get('chatRooms').then((rooms) => {



              component.set('rooms', rooms);
              component.reopen();
            });
            return true;
          });
        } else {
          return false;
        }
      }
    }
  }),



  websockets: Ember.inject.service('websockets'),
  socketRef: null,
  possibleOpenChatCount: Ember.computed(function() {
    return ($(window).width() - 300) / 300;
  }),
  unreadRooms: Ember.computed('sortedRooms.@each.unseenCount.content', function(){
    return this.get('sortedRooms').filter((room) => {
      return !!room.get('unseenCount.content');
    }).length;
  }),
  didInsertElement() {
    this._super(...arguments);
    /*
      2. The next step you need to do is to create your actual websocket. Calling socketFor
      will retrieve a cached websocket if one exists or in this case it
      will create a new one for us.
    */
    const socket = this.get('websockets').socketFor('wss://gke.contetto.io/chats/v1/ws/' + this.get('session.data.authenticated.X-Session'));
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
    //   console.log(`On open event has been called: ${event}`);
    //    console.log("main socket stream");
  },

  myMessageHandler(event) {
    console.log(event);
    const _this = this;
    if (event.data != null && event.data != "") {
      let data = JSON.parse(event.data);

      if (data.room != null && data.room != "") {
        // this.send('microChat', data.room);
        _this.get("microchat").handleSeen(data.room);
      } else {
        if (data.type == "CRUD") {
          if (data.brandId == _this.get("session.brand.id")) {
            var objectType = data.objectType;
            if (data.method == "POST" || data.method == "PATCH") {
              console.log("Doing findRecord on " + objectType + " : " + data.objectId);

              _this.get("store").findRecord(objectType, data.objectId);
            } else if (data.method == "DELETE") {
              _this.get("store").fetchRecord(objectType, data.objectId).then((item) => {
                item.deleteRecord();
              });
            }
          } else {
            console.log("CRUD request ignored for brand " + data.brandId + " as user in context " + _this.get("session.brand.id"));
          }
        }
      }

    }
    //alert(JSON.stringify(event) + " / " + JSON.stringify(event.data));
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
  reopen: function() {
    let component = this;
    this.set('openChats', []);
    this.set('ocIDs', []);
    var mcs = this.get('microchat').fetch(this.get('session.brand.id'));
    mcs.map(function(mc) {
      component.get("ocIDs").push(mc.get('id'));
    });
    component.set("openChats", mcs);
    this.reposition();
  },
  reposition: function(count) {
    // var func = function(){
    //   var mci = 0;
    //   $(".microChatWindow").each(function() {
    //     if($(this).css("display") != "none") {
    //       var ml = mci * 225;
    //       ml = ml - 40;
    //       $(this).css("margin-left", ml);
    //       mci++;
    //     }
    //   })
    // }
    // setTimeout(func, 500);
    // setTimeout(func, 1000);
    // setTimeout(func, 1500);
    // setTimeout(func, 2000);
  },
  openChats: Ember.computed('microchat.data.openChats.length', {
    get() {
      var _this = this;
      this.get('microchat.data.openChats').map(function(oc) {
        _this.get('ocIDs').push(oc.get('id'));
      });
      return this.get('microchat.data.openChats');
    }
  }),
  boxOpenChats: Ember.computed('microchat.data.openChats.length', 'chatListObs', function() {
    if (this.get("microchat.data.openChats.length") > 0) {
      var count = this.get('possibleOpenChatCount');
      return this.get("microchat.data.openChats").slice(0, count);
    }
    return [];
  }),
  listOpenChats: Ember.computed('microchat.data.openChats.length', 'chatListObs', function() {
    var count = this.get('possibleOpenChatCount');
    if (this.get("microchat.data.openChats.length") > count) {
      return this.get("microchat.data.openChats").slice(count, 100);
    }
    return [];
  }),
  ocIDs: [],
  openMicroChat: function(room) {
    if (this.get('microchat').isOpen(room) === false) {
      var component = this;
      var ocids = this.ocIDs;
      if (ocids.includes(room)) {} else {

        this.get('ocIDs').push(room);
        this.get('store').fetchRecord('chatRoom', room).then((roomObj) => {
          roomObj.set("offset", this.get("ocIDs.length"));
          // component.get('openChats').pushObject(roomObj);
          component.get('microchat').add(roomObj, this.get('session.brand.id'));
          component.get('microchat').reshuffle(room);
          component.toggleProperty("chatListObs");
        });
        this.get('microchat').setMState(room, 'block');
        this.get("microchat").handleSeen(room);
        // Ember.run.later(this, function(){
        //   if($('#microchat_' + room).is(":visible")){
        //     $('#microchat_' + room).closest(".micro-chat-wrapper").height(275);
        //     $('#microchat_' + room).closest(".micro-chat-wrapper").width(255);
        //   }
        //   else{
        //     $('#microchat_' + room).closest(".micro-chat-wrapper").height(50);
        //     $('#microchat_' + room).closest(".micro-chat-wrapper").width(150);
        //   }
        // });
        this.reposition();
      }
    }
  },
  chatListObs: false,
  // updateChatRoomAttrs: function(rid){
  //   if($('#microchat_' + rid).is(":visible")){
  //     $('#microchat_' + rid).closest(".micro-chat-wrapper").height(50);
  //     $('#microchat_' + rid).closest(".micro-chat-wrapper").width(150);
  //   }
  //   else{
  //     $('#microchat_' + rid).closest(".micro-chat-wrapper").height(275);
  //     $('#microchat_' + rid).closest(".micro-chat-wrapper").width(255);
  //   }
  // },
  actions: {
    reshuffleOpenChats: function(room) {
      this.get("microchat").reshuffle(room.get("id"));
      this.toggleProperty("chatListObs");
      // Ember.run.later(this, function(){
      //   if($('#microchat_' + room.get("id")).is(":visible")){
      //     $('#microchat_' + room.get("id")).closest(".micro-chat-wrapper").height(275);
      //     $('#microchat_' + room.get("id")).closest(".micro-chat-wrapper").width(255);
      //   }
      //   else{
      //     $('#microchat_' + room.get('id')).closest(".micro-chat-wrapper").height(50);
      //     $('#microchat_' + room.get('id')).closest(".micro-chat-wrapper").width(150);
      //   }
      // });
    },
    microChat: function(room) {

      var component = this;
      let foundMe = false;

      var me = this.get("session.data.authenticated.userId");
      var rid = room;
      this.get('store').fetchRecord('chatRoom', rid).then((r) => {
        Ember.RSVP.all(r.get('users').map(function(user) {
          if (user.get('id') == me) {
            foundMe = true;

          }
        })).then(function() {


          if (foundMe === false) {
            if (r.get("private")) {
              alert("This chat room is private, and you are not a member.");
            } else {
              if (confirm("Join #" + r.get("name") + "?")) {
                component.get('store').fetchRecord('user', me).then((meObj) => {
                  r.get("users").pushObject(meObj);
                  r.save().then(function() {
                    component.openMicroChat(room);
                  });

                });
              }
            }
          } else {


            component.openMicroChat(room);
          }
        });
      });
    },

    closeMC: function(rid) {
      var newOCIDs = [];
      this.get('ocIDs').map(function(ocid) {
        if (ocid != rid) {
          newOCIDs.push(ocid);
        }
      });
      this.get('microchat').setMState(rid, 'closed');

      let component = this;
      this.set('ocIDs', newOCIDs);
      this.get('store').fetchRecord('chatRoom', rid).then((room) => {
        //   component.get('openChats').removeObject(room);
        component.get('microchat').remove(room, this.get('session.brand.id'));
      });
      this.reposition();
    },
    toggleMC: function(rid) {
      var state = this.get("microchat").getMState(rid);
      var newstate = 'block';
      if (state == 'block' || state == null) {
        newstate = 'none';
      }
      this.get('microchat').setMState(rid, newstate);
      if (newstate == 'block') {
        this.get("microchat").handleSeen(rid);
      }
      // this.updateChatRoomAttrs(rid);
      $('#microchat_' + rid).css('display', newstate);
      this.reposition();
    },
    toggleRoomList: function() {
      /*global $*/
      $(".chatRoomListWindow").toggle();
      if ($(".chatRoomListWindow").is(":visible")) {
        $(".room-list-wrapper").height(220);
        $(".room-list-wrapper").width(200);
      } else {
        $(".room-list-wrapper").height(40);
        $(".room-list-wrapper").width(100);
      }
      this.reposition();
    },
    openExtraChatList: function() {
      if (this.get("extraChatList")) {
        this.set("extraChatList", false);
      } else {
        this.set("extraChatList", true);
      }
    },
    closeExtraChatList: function() {
      this.set("extraChatList", false);
    }
  }

});
