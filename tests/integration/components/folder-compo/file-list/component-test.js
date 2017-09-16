import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('folder-compo/file-list', 'Integration | Component | folder compo/file list', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{folder-compo/file-list}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#folder-compo/file-list}}
      template block text
    {{/folder-compo/file-list}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
