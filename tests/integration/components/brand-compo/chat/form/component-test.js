import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('brand-compo/chat/form', 'Integration | Component | brand compo/chat/form', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{brand-compo/chat/form}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#brand-compo/chat/form}}
      template block text
    {{/brand-compo/chat/form}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
