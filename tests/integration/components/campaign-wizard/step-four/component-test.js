import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('campaign-wizard/step-four', 'Integration | Component | campaign wizard/step four', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{campaign-wizard/step-four}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#campaign-wizard/step-four}}
      template block text
    {{/campaign-wizard/step-four}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
