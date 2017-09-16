import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('inbox-charts/brand-user-replies', 'Integration | Component | inbox charts/brand user replies', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{inbox-charts/brand-user-replies}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#inbox-charts/brand-user-replies}}
      template block text
    {{/inbox-charts/brand-user-replies}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
