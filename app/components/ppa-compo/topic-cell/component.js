import Ember from 'ember';

export default Ember.Component.extend({
    quickpost: Ember.inject.service('quickpost'),
    actions: {
        openPost(post) {
            this.get("quickpost").editPost(post);
        }
    },
});
