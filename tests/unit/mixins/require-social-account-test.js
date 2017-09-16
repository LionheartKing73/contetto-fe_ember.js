import Ember from 'ember';
import RequireSocialAccountMixin from 'contetto/mixins/require-social-account';
import { module, test } from 'qunit';

module('Unit | Mixin | require social account');

// Replace this with your real tests.
test('it works', function(assert) {
  let RequireSocialAccountObject = Ember.Object.extend(RequireSocialAccountMixin);
  let subject = RequireSocialAccountObject.create();
  assert.ok(subject);
});
