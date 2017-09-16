import Ember from 'ember';

export default Ember.Component.extend({

    loaded: false,
    _ots: [],
    ots: Ember.computed('_ots', function() {
        return this.get("_ots");
    }),
    store: Ember.inject.service('store'),
    init() {
        this._super();
        this.set('loaded', false);
        Ember.run.once(this, 'setupTypes');
    },
    setupTypes: function() {
        var self = this;
        this.get("store").findAll("offsetType").then((ots) => {
            self.set("_ots", ots);

            self.set("loaded", true);
        });

        if (this.get("post.slot")) {

            this.set("ps.offset", this.get("post.slot.offset"));
            this.set("ps.offsetType", this.get("post.slot.offsetType"));
        }


    }
});
