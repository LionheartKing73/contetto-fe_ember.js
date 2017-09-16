import Ember from 'ember';

export default Ember.Component.extend({
    ajax: Ember.inject.service("ajax"),
    _scheduled: [],
    _freeslots: [],

    quickpost: Ember.inject.service('quickpost'),
    fssortDefinition: ['calctime:asc'],
    freeslots: Ember.computed.sort('_freeslots', 'fssortDefinition'),
    session: Ember.inject.service('session'),

    store: Ember.inject.service('store'),
    scheduled: Ember.computed('_scheduled', function() {
        return this.get("_scheduled");
    }),
    postFollowups: Ember.computed('post.followups.@each.id', 'post.followups.length', function() {
        return this.get("post.followups").filter((followup) => {
            return !!followup.get("id");
        });
    }),

    init() {
        this._super();
        this.set("_scheduled", []);
        this.set("_freeslots", []);

        Ember.run.once(this, 'getFreeSlots');

    },
    getFreeSlots() {
        var self = this;
        this.get("ajax").request("https://gke.contetto.io/postings/v1/blogFollowupSlots?posting=" + this.get("post.id")).then((data) => {
            self.set("_freeslots", []);
            data.forEach(function(item) {

                self.get("store").fetchRecord("followupSlot", item.data.id).then((s) => {
                    self.get("_freeslots").pushObject(s);
                });
            });
        });
    },
    actions: {

        createFollowup(slot) {
            var record = this.get("store").createRecord("posting", {
                'brand': this.get("session.brand"),
                'isFollowup': true,
                'followupTo': this.get('post'),
                'slot': slot
            });
            this.get("quickpost").addPost(record);
        },
        newFollowup() {
            var record = this.get("store").createRecord("posting", {
                'brand': this.get("session.brand"),
                'isFollowup': true,
                'followupTo': this.get('post')
            });
            this.get("quickpost").addPost(record);
        },

        editPost(post) {
            this.get("quickpost").editPost(post)
        }

    }

});
