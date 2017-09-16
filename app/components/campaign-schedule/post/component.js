import Ember from 'ember';

export default Ember.Component.extend({
    store: Ember.inject.service('store'),
    session: Ember.inject.service('session'),
    quickpost: Ember.inject.service('quickpost'),
    actions: {
        manage() {
            this.get("quickpost").editPost(this.get("post.posting"));
            //            this.get('router').transitionTo('brand.edit.post.edit', this.get("session.company"), this.get("session.brand"), this.get("post.posting.id"));

        },
        manageFollowup(f) {
            this.get("quickpost").editPost(f);
            //            this.get('router').transitionTo('brand.edit.post.edit', this.get("session.company"), this.get("session.brand"), this.get("post.posting.id"));

        }
    },

    pendingCR: Ember.computed('post.posting.changeRequests.@each', function() {

        var self = this;
        if (this.get("post.posting.changeRequests.length") == 0) {
            console.log("Null CR: " + this.get("post.posting.topic"));
            return null;
        }
        else {
            let crs = this.get("post.posting.changeRequests");
            return crs.filterBy("status.id", "1");
        }
    }),
});
