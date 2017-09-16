import Ember from 'ember';

export default Ember.Service.extend({
    quickposts: null,
    init() {
        this._super(...arguments);
        this.set('quickposts', []);
    },
    store: Ember.inject.service('store'),
    ajax: Ember.inject.service('ajax'),
    session: Ember.inject.service('session'),
    quickPost: function() {
        var self = this;
        self.get("store").findRecord("brand", self.get("session.brand.id")).then((brand) => {
            if (brand.get("socialAccounts.length") > 0) {
                var record = self.get("store").createRecord("posting", {
                    "brand": brand
                });
                self.get("quickposts").pushObject(record);
            }
            else {
                alert("You do not have any social accounts to post to! Please go to Brand Settings > Social Accounts to add them.");
            }
        });
    },
    addPost: function(record) {
        var self = this;
        self.get("quickposts").pushObject(record);
    },
    editPost: function(record) {
        this.get("quickposts").pushObject(record);
    },
    quickBlog: function() {
        var self = this;
        self.get("store").findRecord("brand", self.get("session.brand.id")).then((brand) => {
            if (brand.get("socialAccounts.length") > 0) {
                var record = self.get("store").createRecord("posting", {
                    "brand": brand,
                    "isBlog": 1,
                });
                self.get("quickposts").pushObject(record);
            }
            else {
                alert("You do not have any social accounts to post to! Please go to Brand Settings > Social Accounts to add them.");
            }
        });
    },

    quickPostDone: function(p) {
        this.get("quickposts").removeObject(p);
    },
});
