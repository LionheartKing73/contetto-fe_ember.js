import Ember from 'ember';
import ColumnDefinition from 'ember-bootstrap-table/models/column-definition';
import {
  task
}
from 'ember-concurrency';

const {
  Component,
  get,
  set,
  inject: {
    service
  }
} = Ember;

export default Component.extend({
  store: service(),
  session: service(),
  ajax: service(),

  fromDate: moment(new Date()).subtract(1, 'month').toDate(),
  endDate: moment(new Date()).add(2, 'weeks').toDate(),
  assignmentBacklog: [],

  classNames: ["table-responsive"],

  columns: Ember.computed(function() {
    var col1 = ColumnDefinition.create({
      header: 'Type',
      contentPath: 'posting.networkType.name',
      columnComponentName: 'eb-tables/promise-table-column',
    });
    var col2 = ColumnDefinition.create({
      header: 'Assigned By',
      contentPath: 'requestBy.fullName',
      columnComponentName: 'eb-tables/promise-table-column',
    });
    var col3 = ColumnDefinition.create({
      header: 'Subject',
      contentPath: 'subject',
      columnComponentName: 'eb-tables/promise-table-column',
    });
    var col4 = ColumnDefinition.create({
      header: 'Topic',
      contentPath: 'posting.topic',
      columnComponentName: 'eb-tables/promise-table-column',
    });
    var col5 = ColumnDefinition.create({
      header: 'Due',
      contentPath: 'requestDue',
      columnComponentName: 'eb-tables/datetime-table-column',
    });

    return [col1, col2, col3, col4, col5];
  }),

  didReceiveAttrs() {
    this.get('fetchChartData').perform();
  },

  fetchChartData: task(function*() {
    const brandId = get(this, 'session.brand.id');
    const currentUserId = get(this, 'session.data.authenticated.userId');

    const options = {
      data: {
        brand: brandId,
        assignedToUser: currentUserId,
        status: 1,
        fromDate: moment(get(this, 'fromDate')).utc().format(),
        endDate: moment(get(this, 'endDate')).utc().format()
      }
    };

    yield get(this, 'store').query('changeRequest', options.data).then((changeRequests) => {
      if (get(this, 'isDestroyed') || get(this, 'isDestroying')) {
        return;
      }

      set(this, 'assignmentBacklog', changeRequests.sortBy('requestDue'));
    })
  }).group('chartAjaxTask'),

  actions: {
    setFromDate(date) {
      set(this, 'fromDate', date);
      this.didReceiveAttrs();
    },
    setEndDate(date) {
      set(this, 'endDate', date);
      this.didReceiveAttrs();
    }
  }
});
