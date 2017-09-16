import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('ppa-compo/topic-cell', 'Integration | Component | ppa compo/topic cell', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{ppa-compo/topic-cell}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#ppa-compo/topic-cell}}
      template block text
    {{/ppa-compo/topic-cell}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
