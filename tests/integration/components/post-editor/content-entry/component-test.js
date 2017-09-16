import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('post-editor/content-entry', 'Integration | Component | post editor/content entry', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{post-editor/content-entry}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#post-editor/content-entry}}
      template block text
    {{/post-editor/content-entry}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
