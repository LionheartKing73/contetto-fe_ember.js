import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('every-x-minutes-selector', 'Integration | Component | every x minutes selector', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{every-x-minutes-selector}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#every-x-minutes-selector}}
      template block text
    {{/every-x-minutes-selector}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
