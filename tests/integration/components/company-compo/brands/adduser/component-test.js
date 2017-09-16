import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('company-compo/brands/adduser', 'Integration | Component | company compo/brands/adduser', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{company-compo/brands/adduser}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#company-compo/brands/adduser}}
      template block text
    {{/company-compo/brands/adduser}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
