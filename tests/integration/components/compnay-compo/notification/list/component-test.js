import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('compnay-compo/notification/list', 'Integration | Component | compnay compo/notification/list', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{compnay-compo/notification/list}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#compnay-compo/notification/list}}
      template block text
    {{/compnay-compo/notification/list}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
