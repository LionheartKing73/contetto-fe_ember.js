import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('assignment-calendar/created-filter', 'Integration | Component | assignment calendar/created filter', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{assignment-calendar/created-filter}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#assignment-calendar/created-filter}}
      template block text
    {{/assignment-calendar/created-filter}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
