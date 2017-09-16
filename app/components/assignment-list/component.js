import Ember from 'ember';

export default Ember.Component.extend({
  quickpost: Ember.inject.service('quickpost'),
  session: Ember.inject.service('session'),
  sortDefinition: ['requestTime:desc'],
  sortedAssignments: Ember.computed.sort('assignments', 'sortDefinition'),
  actions: {
    quickPost: function() {
      this.get('quickpost').quickPost();
    },
    quickBlog: function() {
      this.get("quickpost").quickBlog();
    },
    quickPostDone: function() {
      this.get('quickpost').quickPostDone();
    },

    removeAssignment(assignment) {
      this.get('assignments').removeObject(assignment);
    }
  }
});
