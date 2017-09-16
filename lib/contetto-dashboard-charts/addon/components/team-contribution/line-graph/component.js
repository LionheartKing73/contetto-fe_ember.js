import Ember from 'ember';
import groupBy from 'contetto/utils/group-by';
import contettoTheme from 'contetto-dashboard-charts/highchart-themes/contetto-theme';
import { task } from 'ember-concurrency';

const {
  Component,
  get, set,
  inject: { service }
} = Ember;

export default Component.extend({
  store: service(),
  session: service(),

  fromDate: moment(new Date()).subtract(1, 'week').toDate(),
  endDate: moment(new Date()).add(2, 'weeks').toDate(),
  theme: contettoTheme,
  chartData: [],

  chartOptions: {
    chart: {
      type: 'line'
    },
    title: {
      text: null
    },
    xAxis: {
      type: 'datetime'
    },
    yAxis: {
      allowDecimals: false,
      title: {
        text: 'No of posts created'
      }
    }
  },

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

    yield get(this, 'store').query('postingSchedule', options.data).then((schedules) => {
      let contribData = schedules.map((postSchedule) => {
        return postSchedule.get('posting').then((posting) => {
          return {
            postId: posting.get('id'),
            date: moment(postSchedule.get('scheduledTime')).startOf('day').valueOf(),
            creator: posting.get('user.id')
          }
        });
      });

      Ember.RSVP.all(contribData).then((contrib) => {
        let groupedPostings = groupBy(contrib, 'creator');

        let promises = Object.keys(groupedPostings).map((userId) => {
          return get(this, 'store').fetchRecord('user', userId).then((user) => {
            let groupedByDate = groupBy(groupedPostings[userId], 'date');

            let data = Object.keys(groupedByDate).map((date) => {
              return [parseInt(date), groupedByDate[date].get('length')];
            });

            data = data.sort((a, b) => {
              return a[0] - b[0];
            });

            return {
              name: `${user.get('fullName')}`,
              data: data
            };
          });
        });


        Ember.RSVP.all(promises).then((data) => {
          if (get(this, 'isDestroyed') || get(this, 'isDestroying')) {
            return;
          }

          set(this, 'chartData', data);
        });
      });
    });
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
