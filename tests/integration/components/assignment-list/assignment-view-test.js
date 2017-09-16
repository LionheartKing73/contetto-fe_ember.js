import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('assignment-list/assignment-view', 'Integration | Component | assignment list/assignment view', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{assignment-list/assignment-view}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#assignment-list/assignment-view}}
      template block text
    {{/assignment-list/assignment-view}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
