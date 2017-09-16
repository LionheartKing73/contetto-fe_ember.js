import Ember from 'ember';

export default Ember.Component.extend({
    quickpost: Ember.inject.service('quickpost'),
    draftSort: ['posting.createdAt:asc'],
    sortedDrafts: Ember.computed.sort('drafts', 'draftSort'),
    actions: {
        editDraft(post) {
            this.get("quickpost").editPost(post);
        }
    }
});
