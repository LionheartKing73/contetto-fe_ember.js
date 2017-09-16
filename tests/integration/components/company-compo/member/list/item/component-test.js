import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('company-compo/user/list/item', 'Integration | Component | company compo/user/list/item', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{company-compo/user/list/item}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#company-compo/user/list/item}}
      template block text
    {{/company-compo/user/list/item}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
