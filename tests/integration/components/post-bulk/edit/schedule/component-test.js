import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('post-bulk/edit/schedule', 'Integration | Component | post bulk/edit/schedule', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{post-bulk/edit/schedule}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#post-bulk/edit/schedule}}
      template block text
    {{/post-bulk/edit/schedule}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
