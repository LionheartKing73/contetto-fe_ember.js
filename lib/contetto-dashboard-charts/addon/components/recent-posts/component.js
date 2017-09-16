import Ember from 'ember';
import ColumnDefinition from 'ember-bootstrap-table/models/column-definition';
import { task } from 'ember-concurrency';

const {
  Component,
  get, set,
  inject: { service }
} = Ember;

export default Component.extend({
  session: service(),
  store: service(),

  today: new Date(),
  fromDate: moment(new Date()).subtract(2, 'weeks').toDate(),
  recentPosts: [],

  classNames: ["table-responsive"],

  columns: Ember.computed(function() {
    var col1 = ColumnDefinition.create({
      header: 'Title',
      contentPath: 'posting.topic',
      columnComponentName: 'eb-tables/promise-table-column',
    });
    var col2 = ColumnDefinition.create({
      header: 'Type',
      contentPath: 'posting.networkType.name',
      columnComponentName: 'eb-tables/promise-table-column',
    });
    var col3 = ColumnDefinition.create({
      header: 'Account',
      contentPath: 'socialAccount.title',
      columnComponentName: 'eb-tables/promise-table-column',
    });
    var col4 = ColumnDefinition.create({
      header: 'Created By',
      contentPath: 'posting.user.fullName',
      columnComponentName: 'eb-tables/promise-table-column',
    });
    var col5 = ColumnDefinition.create({
      header: 'Time',
      contentPath: 'scheduledTime',
      columnComponentName: 'eb-tables/datetime-table-column',
    });

    return [col1, col2, col3, col4, col5];
  }),

  didReceiveAttrs() {
    this.get('fetchChartData').perform();
  },

  fetchChartData: task(function * () {
    const brandId = get(this, 'session.brand.id');
    const options = {
      data: {
        brand: brandId,
        fromDate: moment(get(this, 'fromDate')).utc().format(),
        endDate: moment(new Date()).utc().format()
      }
    };

    yield get(this, 'store').query('postingSchedule', options.data).then((posts) => {
      if (get(this, 'isDestroyed') || get(this, 'isDestroying')) {
        return;
      }

      set(this, 'recentPosts', posts.sortBy('scheduledTime'));
    });
  }).group('chartAjaxTask'),

  actions: {
    setFromDate(date) {
      set(this, 'fromDate', date);
      this.didReceiveAttrs();
    }
  }
});
