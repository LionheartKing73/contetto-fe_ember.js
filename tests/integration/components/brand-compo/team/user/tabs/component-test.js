import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('brand-compo/team/user/tabs', 'Integration | Component | brand compo/team/user/tabs', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{brand-compo/team/user/tabs}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#brand-compo/team/user/tabs}}
      template block text
    {{/brand-compo/team/user/tabs}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
