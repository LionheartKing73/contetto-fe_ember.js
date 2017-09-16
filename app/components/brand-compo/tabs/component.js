import Ember from 'ember';
import ScrollableTabsMixin from 'contetto/mixins/scrollable-tabs';

const {
  Component,
  inject: { service }
} = Ember;

export default Component.extend(ScrollableTabsMixin, {
  session: service(),

  tabWrapperClass: '.brand_options_tabs_wrapper'
});
