import Ember from 'ember';
import contettoTheme from 'contetto-dashboard-charts/highchart-themes/contetto-theme';
import { task } from 'ember-concurrency';

const {
  Component,
  inject: { service },
  get, set,
  isEmpty
} = Ember;


export default Component.extend({
  session: service(),
  ajax: service(),

  fromDate: moment(new Date()).subtract('2', 'weeks').toDate(),
  endDate: moment(new Date()).toDate(),
  theme: contettoTheme,
  chartData:[],

  chartOptions: {
    chart: {
      zoomType: 'x',
      type: 'line'
    },
    title: {
      text: null
    },
    xAxis: {
      type: 'datetime'
    },
    yAxis: {
      title: {
        text: 'total like/reaction/fav actions'
      }
    }
  },

  didReceiveAttrs() {
    this.get('fetchChartData').perform();
  },

  fetchChartData: task(function * () {
    const accountId = get(this, 'account.id');

    if (!accountId) {
      return;
    }

    const options = {
      data: {
        account: accountId,
        fromDate: moment(get(this, 'fromDate')).utc().format(),
        endDate: moment(get(this, 'endDate')).utc().format()
      }
    };

    yield get(this, 'ajax').request('/social-accounts/v1/engagementMetrics', options).then((resp) => {
      let result = [], chartData = [];

      resp.sortBy('dateTime').forEach((metric) => {
        Object.keys(metric['metrics']).forEach((metricKey) => {
          if (!result[metricKey]) {
            result[metricKey] = [];
          }

          result[metricKey].pushObject([
            new Date(metric.dateTime).valueOf(),
            metric['metrics'][metricKey]
          ]);
        });
      });

      chartData = Object.keys(result).map((metricKey) => {
        return {
          name: metricKey.capitalize(),
          data: result[metricKey]
        }
      })

      if (get(this, 'isDestroyed') || get(this, 'isDestroying')) {
        return;
      }

      set(this, 'chartData', chartData);
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
