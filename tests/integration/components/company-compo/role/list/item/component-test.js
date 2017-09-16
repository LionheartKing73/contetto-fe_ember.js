import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('company-compo/role/list/item', 'Integration | Component | company compo/role/list/item', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{company-compo/role/list/item}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#company-compo/role/list/item}}
      template block text
    {{/company-compo/role/list/item}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
