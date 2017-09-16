import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('slot-list/slot', 'Integration | Component | slot list/slot', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{slot-list/slot}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#slot-list/slot}}
      template block text
    {{/slot-list/slot}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
