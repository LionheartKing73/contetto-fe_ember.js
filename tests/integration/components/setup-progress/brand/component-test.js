import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('setup-progress/brand', 'Integration | Component | setup progress/brand', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{setup-progress/brand}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#setup-progress/brand}}
      template block text
    {{/setup-progress/brand}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
