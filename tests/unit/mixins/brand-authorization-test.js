import Ember from 'ember';
import BrandAuthorizationMixin from 'contetto/mixins/brand-authorization';
import { module, test } from 'qunit';

module('Unit | Mixin | brand authorization');

// Replace this with your real tests.
test('it works', function(assert) {
  let BrandAuthorizationObject = Ember.Object.extend(BrandAuthorizationMixin);
  let subject = BrandAuthorizationObject.create();
  assert.ok(subject);
});
