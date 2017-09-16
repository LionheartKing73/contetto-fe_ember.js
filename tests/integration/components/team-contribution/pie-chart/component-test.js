import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('team-contribution/pie-chart', 'Integration | Component | team contribution/pie chart', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{team-contribution/pie-chart}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#team-contribution/pie-chart}}
      template block text
    {{/team-contribution/pie-chart}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
