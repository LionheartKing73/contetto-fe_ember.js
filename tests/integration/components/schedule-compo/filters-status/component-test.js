import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('schedule-compo/filters-status', 'Integration | Component | schedule compo/filters status', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{schedule-compo/filters-status}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#schedule-compo/filters-status}}
      template block text
    {{/schedule-compo/filters-status}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
