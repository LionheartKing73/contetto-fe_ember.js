import Ember from 'ember';

export default Ember.Component.extend({
    roomMessages: [],
    ajax: Ember.inject.service("ajax"),
    messageSort: ['createdAt:asc'],
    sortedMessages: Ember.computed.sort('roomMessages', 'messageSort'),
    store: Ember.inject.service('store'),
    session: Ember.inject.service("session"),
    replyText: "",
    noTM: false,
    updating: false,
    actionName: null,
    test: true,
    tried: 0,
    getAName: function() {
        if ((this.get("actionName") == "" || this.get("actionName") == null) && this.get("tried") < 4) {
            if (this.get("sortedMessages.length") > 0) {

                var self = this;
                if (self.get("actionName") == "" || self.get("actionName") == null) {
                    Ember.RSVP.all(this.get("sortedMessages").map(function(msg) {
                        if (self.get("actionName") == "" || self.get("actionName") == null) {
                            return self.get("store").fetchRecord("inboxItem", msg.get("id")).then((m) => {
                                if (m.get("inboxAction.id")) {
                                    return self.get("store").fetchRecord("inboxAction", m.get("inboxAction.id")).then((ia) => {
                                        if (ia.get("name") != "undefined") {

                                            self.set("actionName", ia.get("name"));
                                        }
                                        else {}
                                        return true;
                                    });
                                }
                                else {
                                    return true;
                                }
                            });
                        }
                    })).then(function() {

                        self.set("test", false);
                        self.set("tried", (self.get("tried") + 1));
                    });
                }

            }
        }
    },
    actionType: Ember.computed('sortedMessages', function() {
        if (this.get("actionName") == null || this.get("actionName") == "") {
            Ember.run.once(this, "getAName");
        }
    }),
    aName: Ember.computed("actionName", function() {
        return this.get("actionName");
    }),
    socialAccount: Ember.computed("sortedMessages", function() {
        return this.get("sortedMessages.firstObject.account.id");
    }),
    init() {
        this._super();
        var self = this;
        this.set("test", true);
        this.set("tried", 0);
        this.set("sendFile", null);
        this.set("noTM", false);
        this.set("roomMessages", []);
        this.get("room.messages").forEach((message) => {
            self.get("store").fetchRecord('inboxItem', message.get('id')).then((msg) => {

                if (self.get("room.topMessage.id") == msg.get("id")) {
                    self.set("noTM", true);
                }
                self.get("roomMessages").pushObject(msg);
            });
        });

        Ember.run.later((function() {
            self.syncTime();
        }), 60000);
    },
    update() {
        var self = this;
        this.set("updating", true);
        this.get('store').findRecord('inboxRoom', this.get("room.id"), {
            'reload': true
        }).then((room) => {
            self.set("roomMessages", []);
            Ember.RSVP.all(room.get("messages").map((message) => {

                if (self.get("room.topMessage.id") == message.get("id")) {
                    self.set("noTM", true);
                }
                self.get("roomMessages").pushObject(message);
            })).then(function() {
                self.set("updating", false);
            });


        });
    },
    sync() {
        var self = this;
        this.set("checking", true);

        this.get("ajax").request("https://gke.contetto.io/social-sync/v1/refresh?account=" + this.get("room.socialAccount.id")).then((r) => {
            self.update();
            self.set("checking", false);
        });
    },
    syncTime() {

        var self = this;
        this.set("checking", true);
        this.get("ajax").request("https://gke.contetto.io/social-sync/v1/refresh?account=" + this.get("room.socialAccount.id")).then((r) => {
            self.update();
            self.set("checking", false);
            Ember.run.later((function() {
                self.syncTime();
            }), 60000);
        });

    },
    checking: false,
    sendFile: null,
    actions: {
        sync() {


            if (!this.get("checking")) {
                this.sync();
            }
        },
        addReplyFile(file) {
            this.set('sendFile', file);
        },
        removeReplyFile() {
            this.set("sendFile", null);
        },
        send() {

            var self = this;

            if (Ember.isEmpty(this.get('replyText'))) {
                return this.set('replyError', "Reply cannot be empty!");
            }
            else {
                this.set('replyError', null);
            }

            var record = this.get("store").createRecord("inboxItem", {
                file: this.get("sendFile"),
                content: this.get("replyText"),
                brand: this.get('brand'),
                room: this.get("room"),
                account: this.get("room.socialAccount"),
                user: this.get("store").findRecord("user", this.get("session.data.authenticated.userId"))
            });

            record.save().then((record) => {
                alert("Sent!");
                self.set("replyText", "");
                self.set("sendFile", "");
                self.get("store").findRecord("inboxRoom", self.get("room.id"));
            });

        }
    }
});
