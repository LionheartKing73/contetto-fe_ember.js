import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('contetto-datetime-picker', 'Integration | Component | contetto datetime picker', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{contetto-datetime-picker}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#contetto-datetime-picker}}
      template block text
    {{/contetto-datetime-picker}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
