import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('schedule-compo/filters-account', 'Integration | Component | schedule compo/filters account', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{schedule-compo/filters-account}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#schedule-compo/filters-account}}
      template block text
    {{/schedule-compo/filters-account}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
