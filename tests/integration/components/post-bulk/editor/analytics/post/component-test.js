import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('post-bulk/editor/analytics/post', 'Integration | Component | post bulk/editor/analytics/post', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{post-bulk/editor/analytics/post}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#post-bulk/editor/analytics/post}}
      template block text
    {{/post-bulk/editor/analytics/post}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
