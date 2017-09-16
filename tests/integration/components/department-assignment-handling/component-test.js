import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('department-assignment-handling', 'Integration | Component | department assignment handling', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{department-assignment-handling}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#department-assignment-handling}}
      template block text
    {{/department-assignment-handling}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
