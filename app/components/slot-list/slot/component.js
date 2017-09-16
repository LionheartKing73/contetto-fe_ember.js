import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'tr',
    uid: function() {
        var d = new Date().getTime();

        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    },
    store: Ember.inject.service('store'),
    session: Ember.inject.service('session'),
    quickpost: Ember.inject.service('quickpost'),
    actions: {
        manage() {


            var record = this.get("store").createRecord("posting", {
                "networkType": this.get("slot.networkType"),
                "brand": this.get("session.brand"),
                'preset': true
            });

            if (this.get("slot.socialAccount.platform") == "wordpress") {
                record.set("isBlog", true);
            }
            var psr = this.get("store").createRecord("postingSchedule", {
                'socialAccount': this.get("slot.socialAccount"),
                'dateTime': this.get("slot.dateTime"),
                'posting': record,
                'preset': true,
                'tempID': this.uid()
            });
            record.get("postingSchedules").pushObject(psr);
            // record.get("socialAccounts").pushObject(e.socialAccount);
            this.get("quickpost").addPost(record);


        }
    }
});
