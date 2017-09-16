import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('auth-compo/unverified-user', 'Integration | Component | auth compo/unverified user', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{auth-compo/unverified-user}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#auth-compo/unverified-user}}
      template block text
    {{/auth-compo/unverified-user}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
