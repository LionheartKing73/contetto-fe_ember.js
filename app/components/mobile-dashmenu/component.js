import Ember from 'ember';

export default Ember.Component.extend({
    session: Ember.inject.service('session'),
    classNames: ['mobileOnly', 'mobile-dashmenu'],
    quickpost: Ember.inject.service('quickpost'),
    actions: {
        quickPost() {
            this.get("quickpost").quickPost();
        },
        quickBlog() {
            this.get("quickpost").quickBlog();
        }
    }
});
