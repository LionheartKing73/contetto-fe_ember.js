import Ember from 'ember';

export default Ember.Component.extend({
    store: Ember.inject.service('store'),
    didReceiveAttrs() {
        var self = this;
        this.get("store").findRecord("posting", this.get("post.id")).then(function(p) {
            if (p.get("isDirty")) {
                p.rollback().then(function() {

                    self.get("router").transitionTo("brand.edit.post.edit", self.get("brand.id"), self.get("post.id"));
                });
            }
            else {
                self.get("router").transitionTo("brand.edit.post.edit", self.get("brand.id"), self.get("post.id"));

            }
        });
    }
});
