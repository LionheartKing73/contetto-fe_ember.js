import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('schedule-daymanager/timelist', 'Integration | Component | schedule daymanager/timelist', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{schedule-daymanager/timelist}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#schedule-daymanager/timelist}}
      template block text
    {{/schedule-daymanager/timelist}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
