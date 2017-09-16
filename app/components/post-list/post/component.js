import Ember from 'ember';

export default Ember.Component.extend({
    store: Ember.inject.service('store'),
    session: Ember.inject.service('session'),
    quickpost: Ember.inject.service('quickpost'),
    actions: {
        manage() {
            this.get("quickpost").editPost(this.get("post.posting"));
            //            this.get('router').transitionTo('brand.edit.post.edit', this.get("session.company"), this.get("session.brand"), this.get("post.posting.id"));

        }
    }
});
