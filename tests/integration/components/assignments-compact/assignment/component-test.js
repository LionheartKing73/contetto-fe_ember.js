import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('assignments-compact/assignment', 'Integration | Component | assignments compact/assignment', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{assignments-compact/assignment}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#assignments-compact/assignment}}
      template block text
    {{/assignments-compact/assignment}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
