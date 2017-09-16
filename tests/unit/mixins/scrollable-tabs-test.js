import Ember from 'ember';
import ScrollableTabsMixin from 'contetto/mixins/scrollable-tabs';
import { module, test } from 'qunit';

module('Unit | Mixin | scrollable tabs');

// Replace this with your real tests.
test('it works', function(assert) {
  let ScrollableTabsObject = Ember.Object.extend(ScrollableTabsMixin);
  let subject = ScrollableTabsObject.create();
  assert.ok(subject);
});
