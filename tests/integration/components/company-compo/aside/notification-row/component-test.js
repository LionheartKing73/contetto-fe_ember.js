import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('company-compo/aside/notification-row', 'Integration | Component | company compo/aside/notification row', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{company-compo/aside/notification-row}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#company-compo/aside/notification-row}}
      template block text
    {{/company-compo/aside/notification-row}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
