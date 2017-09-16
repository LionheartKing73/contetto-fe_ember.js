import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('socialaccount-schedulemanager', 'Integration | Component | socialaccount schedulemanager', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{socialaccount-schedulemanager}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#socialaccount-schedulemanager}}
      template block text
    {{/socialaccount-schedulemanager}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
