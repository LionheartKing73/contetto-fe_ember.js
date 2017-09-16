import Ember from 'ember';
import TableColumn from 'ember-bootstrap-table/components/eb-table-column';

const {
  get
} = Ember;

export default TableColumn.extend({
  layout: Ember.HTMLBars.compile(`{{get row contentPath}}`),

  contentPath: Ember.computed('column', {
    get: function() {
      var column = get(this, 'column');
      return get(column, 'contentPath');
    }
  })
});
