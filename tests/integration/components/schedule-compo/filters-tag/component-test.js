import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('schedule-compo/filters-tag', 'Integration | Component | schedule compo/filters tag', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{schedule-compo/filters-tag}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#schedule-compo/filters-tag}}
      template block text
    {{/schedule-compo/filters-tag}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
