import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('company-compo/invite/list', 'Integration | Component | company compo/invite/list', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{company-compo/invite/list}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#company-compo/invite/list}}
      template block text
    {{/company-compo/invite/list}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
