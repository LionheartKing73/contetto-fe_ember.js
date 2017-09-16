import Ember from 'ember';
import ScrollableTabsMixin from 'contetto/mixins/scrollable-tabs';

const {
  Component
} = Ember;

export default Component.extend(ScrollableTabsMixin, {
  classNames: ['brand_selection_bar_wrapper'],

  tabWrapperClass: '.brand_tabs_wrapper'
});
