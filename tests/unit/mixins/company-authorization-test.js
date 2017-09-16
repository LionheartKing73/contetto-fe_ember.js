import Ember from 'ember';
import CompanyAuthorizationMixin from 'contetto/mixins/company-authorization';
import { module, test } from 'qunit';

module('Unit | Mixin | company authorization');

// Replace this with your real tests.
test('it works', function(assert) {
  let CompanyAuthorizationObject = Ember.Object.extend(CompanyAuthorizationMixin);
  let subject = CompanyAuthorizationObject.create();
  assert.ok(subject);
});
