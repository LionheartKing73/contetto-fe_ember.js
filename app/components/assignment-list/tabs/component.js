import Ember from 'ember';
import ScrollableTabsMixin from 'contetto/mixins/scrollable-tabs';

const {
    Component,
    on,
    run: {
        scheduleOnce,
        throttle,
        later
    },
    inject: {
        service
    }
} = Ember;

export default Component.extend(ScrollableTabsMixin, {
  session: Ember.inject.service(),
  tabWrapperClass: '.assignment_options_tabs_wrapper',
  isAssigned: Ember.computed('router.currentRouteName', {get() {
    if (this.get("router.currentRouteName") == 'brand.edit.assignments.assigned') {
      return true;
    } else {
      return false;
    }
  }
  }),
  isCreated: Ember.computed('router.currentRouteName', {get() {
    if (this.get("router.currentRouteName") == 'brand.edit.assignments.created') {
      return true;
    } else {
      return false;
    }
  }
  })
});
