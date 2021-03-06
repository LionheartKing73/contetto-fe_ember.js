import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('inbox-charts/brand-action-type/pie-chart', 'Integration | Component | inbox charts/brand action type/pie chart', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{inbox-charts/brand-action-type/pie-chart}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#inbox-charts/brand-action-type/pie-chart}}
      template block text
    {{/inbox-charts/brand-action-type/pie-chart}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
