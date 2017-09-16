import Ember from 'ember';
import groupBy from 'contetto/utils/group-by';
import contettoTheme from 'contetto-dashboard-charts/highchart-themes/contetto-theme';
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

  fromDate: moment(new Date()).subtract(1, 'week').toDate(),
  endDate: moment(new Date()).add(2, 'weeks').toDate(),
  theme: contettoTheme,
  chartData: [],

  chartOptions: {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: 'pie'
    },
    title: {
      text: null
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.y}',
          style: {
            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
          }
        }
      }
    }
  },

  didReceiveAttrs() {
    this.get('fetchChartData').perform();
  },

  fetchChartData: task(function*() {
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

      Ember.RSVP.all(contribData).then((data) => {
        let series = {
          name: 'Post Created',
          colorByPoint: true
        };

        let groupedPostings = groupBy(data, 'creator');

        let promises = Object.keys(groupedPostings).map((userId) => {
          return get(this, 'store').fetchRecord('user', userId).then((user) => {
            return {
              name: `${user.get('fullName')}`,
              y: groupedPostings[userId].get('length')
            };
          });
        });

        Ember.RSVP.all(promises).then((chartData) => {
          if (get(this, 'isDestroyed') || get(this, 'isDestroying')) {
            return;
          }

          series.data = chartData;

          set(this, 'chartData', [series]);
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
