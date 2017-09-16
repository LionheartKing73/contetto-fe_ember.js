import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('brand-compo/dashboard/social-growth', 'Integration | Component | brand compo/dashboard/social growth', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{brand-compo/dashboard/social-growth}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#brand-compo/dashboard/social-growth}}
      template block text
    {{/brand-compo/dashboard/social-growth}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
