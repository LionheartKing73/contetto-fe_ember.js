import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('schedule-daymanager/timeblock', 'Integration | Component | schedule daymanager/timeblock', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{schedule-daymanager/timeblock}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#schedule-daymanager/timeblock}}
      template block text
    {{/schedule-daymanager/timeblock}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
