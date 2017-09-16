import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('post-editor/change-request-history/change-request', 'Integration | Component | post editor/change request history/change request', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{post-editor/change-request-history/change-request}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#post-editor/change-request-history/change-request}}
      template block text
    {{/post-editor/change-request-history/change-request}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
