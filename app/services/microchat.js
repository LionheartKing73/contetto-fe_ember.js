import Ember from 'ember';

export default Ember.Service.extend({
    data: null,

    init() {
        this._super(...arguments);
        this.set('data', []);
    },
    store: Ember.inject.service('store'),
    ajax: Ember.inject.service('ajax'),
    session: Ember.inject.service('session'),
    reshuffle(room){
      var openChats = this.get("data.openChats");
      var firstRoomIndex;
      var firstRoom;
      openChats.forEach(function(chat, index){
        if(chat.get("id")==room){
          firstRoom = chat;
          firstRoomIndex = index;
          return;
        }
      });
      openChats.splice(firstRoomIndex, 1)
      openChats.unshift(firstRoom);
      this.set("data.openChats", openChats);
    },
    handleSeen(room) {
        /*global $*/
        let _this = this;
        if (this.getMState(room) == 'block' || $('#chatroom_' + room).length > 0) {
            //            alert("Seen update " + room);

            this.get('ajax').request('https://gke.contetto.io/chats/v1/lastSeen', {
                data: {
                    'room': room,
                    'user': this.get('session.data.authenticated.userId')
                }
            }).then((r) => {
                if (r.data.length == 0) {
                    /*global moment*/
                    _this.get('store').fetchRecord('user', this.get('session.data.authenticated.userId')).then((me) => {
                        _this.get('store').fetchRecord('chatRoom', room).then((roomObj) => {
                            var newls = _this.get('store').createRecord('lastSeen', {
                                'user': me,
                                'room': roomObj,
                                'lastSeen': moment.utc().format()
                            });
                            newls.save().then(() => {
                              this.get('store').peekRecord("chat-room", room).reloadUnseenCount();
                            });
                        });
                    });
                }
                else {
                    if (r.data.length > 1) {
                        r.data.map(function(ls) {
                            _this.get('store').fetchRecord('lastSeen', ls.id).then((lsO) => {
                                lsO.deleteRecord();
                                lsO.save().then(() => {
                                  this.get('store').peekRecord("chat-room", room).reloadUnseenCount();
                                });
                            });
                        });
                    }
                    else {
                        var ls = r.data[0];
                        _this.get('store').fetchRecord('lastSeen', ls.id).then((lsO) => {
                            lsO.set('lastSeen', moment.utc().format());
                            lsO.save().then(() => {
                              this.get('store').peekRecord("chat-room", room).reloadUnseenCount();
                            });
                        });
                    }
                }

            });
        }
        else {


            if (this.getMState(room) != 'none') {

                this.setMState(room, 'block');
                this.get("store").findRecord("chatRoom", room).then((room) => {
                    _this.add(room, room.get('brand.id'));
                });
            }
        }

    },
    setMState(room, state) {
        if (!this.data['state']) {
            this.data['state'] = [];
        }
        this.data['state'][room] = state;
    },
    getMState(room) {
        if (!this.data['state']) {
            this.data['state'] = [];
        }
        return this.data['state'][room];
    },
    add(obj, brand) {
        if (!this.data[brand]) {
            this.data[brand] = [];
        }
        this.data[brand].pushObject(obj);
        this.set('data.openChats', this.data[brand]);
        // console.log('OCADD: ' + JSON.stringify(this.get('data.openChats')));
    },
    remove(obj, brand) {
        if (!this.data[brand]) {
            this.data[brand] = [];
        }
        this.data[brand].removeObject(obj);
        this.set('data.openChats', this.data[brand]);
        //  console.log('OCADD: ' + JSON.stringify(this.get('data.openChats')));
    },
    isOpen(room) {

        if (this.data.openChats) {
            var oc = this.data.openChats.map(function(oc) {
                return oc.id;
            });
            if (oc.includes(room)) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    },
    fetch(obj, brand) {
        if (!this.data[brand]) {
            return [];
        }
        return this.data[brand];
    },
    clear() {
        this.set('data', []);
    }
});
