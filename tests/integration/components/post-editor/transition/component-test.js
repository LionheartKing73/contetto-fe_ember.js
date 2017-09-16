import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('post-editor/transition', 'Integration | Component | post editor/transition', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{post-editor/transition}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#post-editor/transition}}
      template block text
    {{/post-editor/transition}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
