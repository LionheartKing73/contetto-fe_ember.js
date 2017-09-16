import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('inbox-compo/room', 'Integration | Component | inbox compo/room', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{inbox-compo/room}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#inbox-compo/room}}
      template block text
    {{/inbox-compo/room}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
