import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('eb-tables/datetime-table-column', 'Integration | Component | eb tables/datetime table column', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{eb-tables/datetime-table-column}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#eb-tables/datetime-table-column}}
      template block text
    {{/eb-tables/datetime-table-column}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
