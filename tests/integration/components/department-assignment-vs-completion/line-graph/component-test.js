import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('department-assignment-vs-completion/line-graph', 'Integration | Component | department assignment vs completion/line graph', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{department-assignment-vs-completion/line-graph}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#department-assignment-vs-completion/line-graph}}
      template block text
    {{/department-assignment-vs-completion/line-graph}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
