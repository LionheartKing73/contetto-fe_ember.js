import Ember from 'ember';

export default Ember.Component.extend({

    store: Ember.inject.service('store'),
    quickpost: Ember.inject.service('quickpost'),
    session: Ember.inject.service("session"),
    micro: true,
    scheduleSort: ['scheduledTime:asc'],
    campaignPostsAll: Ember.computed('postingSchedules.@each.id', 'postingSchedules.@each.scheduledTime', function() {
      return this.get('postingSchedules').sortBy('scheduledTime');
    }),
    campaignPosts: Ember.computed('campaignPostsAll.@each.id', function() {
        /*global moment*/
        return this.get('campaignPostsAll').filter(function(post) {
            return post.get('scheduledTime') >= moment();
        });
    }),
    campaignPostsHistory: Ember.computed('campaignPostsAll.@each.id', function() {
        /*global moment*/
        return this.get('campaignPostsAll').filter(function(post) {
            return post.get('scheduledTime') < moment();
        });
    }),
    actions: {

        quickPost() {
            var record = this.get("store").createRecord("posting", {
                "brand": this.get("session.brand"),
                "campaign": this.get("campaign")
            });
            this.get("quickpost").addPost(record);

        },

        quickBlog() {

            var record = this.get("store").createRecord("posting", {
                "brand": this.get("session.brand"),
                "campaign": this.get("campaign"),
                "isBlog": true
            });
            this.get("quickpost").addPost(record);

        }
    }




});
