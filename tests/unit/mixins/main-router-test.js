import Ember from 'ember';
import MainRouterMixin from 'contetto/mixins/main-router';
import { module, test } from 'qunit';

module('Unit | Mixin | main router');

// Replace this with your real tests.
test('it works', function(assert) {
  let MainRouterObject = Ember.Object.extend(MainRouterMixin);
  let subject = MainRouterObject.create();
  assert.ok(subject);
});
