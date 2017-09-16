import Ember from 'ember';

export default Ember.Component.extend({
    store: Ember.inject.service('store'),
    session: Ember.inject.service('session'),
    replyText: "",
    sendFile: "",
    init() {
        this._super();
        this.set("replyText", "");
        this.set("sendFile", "");
    },
    didInsertElement: function() {
        if (this.get("highlight")) {
            Ember.run.later(this, function() {
                $(document).scrollTop(this.$().offset().top);
                this.$('.my-card').addClass("msg-highlight");
                this.$('.header').addClass("msg-highlight");
            }, 1000);
            Ember.run.later(this, function() {
                this.$('.my-card').removeClass("msg-highlight");
                this.$('.header').removeClass("msg-highlight");
            }, 3000);
        }
    },
    replycount: Ember.computed('message.room.messages.length', function() {
        var l = this.get("message.room.messages.length");
        l = l - 1;
        if (l < 0) {
            return 0;
        }
        return l;
    }),
    actions: {
        flag() {
            this.set("message.flagged", true);
            this.get("message").save();
        },
        unflag() {
            this.set("message.flagged", false);
            this.get("message").save();

        },
        complete() {},
        archive() {
            if (confirm("Archive this message?")) {
                this.set("message.archive", true);
                this.get("message").save();
            }
        },
        unarchive() {
            if (confirm("Restore this message?")) {
                this.set("message.archive", false);
                this.get("message").save();
            }
        },
        respond() {},
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




            var record = this.get("store").createRecord('inboxItem', {
                brand: this.get("brand"),
                parentItem: this.get("message"),
                account: this.get("message.socialAccount"),
                content: this.get("replyText"),
                file: this.get('sendFile'),
                user: this.get("store").findRecord("user", this.get("session.data.authenticated.userId"))
            });

            record.save().then((msg) => {
                alert("Sent!");
                self.set("replyText", "");
                self.set("sendFile", "");
            });

        }
    }
});
