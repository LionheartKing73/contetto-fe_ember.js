import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('brand-compo/dashboard/social-engagement', 'Integration | Component | brand compo/dashboard/social engagement', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{brand-compo/dashboard/social-engagement}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#brand-compo/dashboard/social-engagement}}
      template block text
    {{/brand-compo/dashboard/social-engagement}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
