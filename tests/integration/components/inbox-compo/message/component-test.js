import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('inbox-compo/message', 'Integration | Component | inbox compo/message', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{inbox-compo/message}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#inbox-compo/message}}
      template block text
    {{/inbox-compo/message}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
