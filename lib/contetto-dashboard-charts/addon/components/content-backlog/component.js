import Ember from 'ember';
import ColumnDefinition from 'ember-bootstrap-table/models/column-definition';
import { task } from 'ember-concurrency';

const {
  Component,
  get, set,
  inject: { service }
} = Ember;

export default Component.extend({
  store: service(),
  session: service(),
  ajax: service(),

  fromDate: moment(new Date()).toDate(),
  endDate: moment(new Date()).add(2, 'weeks').toDate(),
  upcomingSlots: [],

  classNames: ["table-responsive"],

  columns: Ember.computed(function() {
    var col1 = ColumnDefinition.create({
      header: 'Time',
      contentPath: 'dateTime',
      columnComponentName: 'eb-tables/datetime-table-column',
    });
    var col2 = ColumnDefinition.create({
      header: 'Account',
      contentPath: 'account.title',
      columnComponentName: 'eb-tables/promise-table-column',
    });
    var col3 = ColumnDefinition.create({
      header: 'Type',
      contentPath: 'type'
    });

    return [col1, col2, col3];
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
        endDate: moment(get(this, 'endDate')).utc().format()
      }
    };

    yield get(this, 'ajax').request('/postings/v1/accountFreeSlots', options).then((resp) => {
      const result = resp.map((slot) => {
        return {
          dateTime: new Date(slot.dateTime),
          type: slot.networkType === 1 ? 'Engagement' : 'Marketing',
          account: get(this, 'socialAccounts').findBy('id', slot.socialAccount),
        }
      });

      if (get(this, 'isDestroyed') || get(this, 'isDestroying')) {
        return;
      }

      set(this, 'upcomingSlots', result.sort((a, b) => {
        return a.dateTime.valueOf() - b.dateTime.valueOf();
      }));
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
