import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('brand-compo/product/group/list/item', 'Integration | Component | brand compo/product/group/list/item', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{brand-compo/product/group/list/item}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#brand-compo/product/group/list/item}}
      template block text
    {{/brand-compo/product/group/list/item}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
