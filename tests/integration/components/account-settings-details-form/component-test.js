import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('account-settings-details-form', 'Integration | Component | account settings details form', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{account-settings-details-form}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#account-settings-details-form}}
      template block text
    {{/account-settings-details-form}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
