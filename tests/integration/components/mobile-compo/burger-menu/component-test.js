import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('mobile-compo/burger-menu', 'Integration | Component | mobile compo/burger menu', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{mobile-compo/burger-menu}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#mobile-compo/burger-menu}}
      template block text
    {{/mobile-compo/burger-menu}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
