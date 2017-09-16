import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('team-contribution/line-graph', 'Integration | Component | team contribution/line graph', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{team-contribution/line-graph}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#team-contribution/line-graph}}
      template block text
    {{/team-contribution/line-graph}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
