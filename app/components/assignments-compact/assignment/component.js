import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'tr',
    quickpost: Ember.inject.service('quickpost'),
    session: Ember.inject.service('session'),
    actions: {
        manage(post) {
            this.get("quickpost").editPost(post);
        }
    }
});
