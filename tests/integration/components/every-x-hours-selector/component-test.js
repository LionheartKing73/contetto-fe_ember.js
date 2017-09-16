import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('every-x-hours-selector', 'Integration | Component | every x hours selector', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{every-x-hours-selector}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#every-x-hours-selector}}
      template block text
    {{/every-x-hours-selector}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
