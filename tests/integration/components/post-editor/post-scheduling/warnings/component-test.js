import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('post-editor/post-scheduling/warnings', 'Integration | Component | post editor/post scheduling/warnings', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{post-editor/post-scheduling/warnings}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#post-editor/post-scheduling/warnings}}
      template block text
    {{/post-editor/post-scheduling/warnings}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
