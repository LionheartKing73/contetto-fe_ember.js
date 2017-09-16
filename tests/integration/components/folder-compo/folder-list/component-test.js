import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('folder-compo/folder-list', 'Integration | Component | folder compo/folder list', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{folder-compo/folder-list}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#folder-compo/folder-list}}
      template block text
    {{/folder-compo/folder-list}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
