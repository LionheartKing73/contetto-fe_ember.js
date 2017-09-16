import Ember from 'ember';
import ScrollableTabsMixin from 'contetto/mixins/scrollable-tabs';

const {
  Component,
  inject: {
    service
  }
} = Ember;

export default Component.extend(ScrollableTabsMixin, {
  session: service(),
  quickpost: Ember.inject.service('quickpost'),
  classNames: ['row'],

  tabWrapperClass: '.company_tabs_wrapper',

  actions: {
    quickPost: function() {
      this.get('quickpost').quickPost();
    },
    quickBlog: function() {
      this.get('quickpost').quickBlog();
    },
    quickPostDone: function() {
      this.get('quickpost').quickPostDone();
    },
  }
});
