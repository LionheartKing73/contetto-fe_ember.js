import Ember from 'ember';
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
  ajax: service(),
  session: service(),

  fromDate: moment(new Date()).subtract('2', 'weeks').toDate(),
  endDate: moment(new Date()).toDate(),
  theme: contettoTheme,
  chartData: [],

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
        text: 'Number of the followers/likes at the page'
      }
    }
  },

  didReceiveAttrs() {
    this.get('fetchChartData').perform();
  },

  fetchChartData: task(function*() {
    const brandId = get(this, 'session.brand.id');

    if (!brandId) {
      return;
    }

    const options = {
      data: {
        brand: brandId,
        fromDate: moment(get(this, 'fromDate')).utc().format(),
        endDate: moment(get(this, 'endDate')).utc().format()
      }
    };

    yield get(this, 'ajax').request('/social-accounts/v1/pageMetrics', options).then((resp) => {
      let resultMetrics = {},
        graphData = [];

      let result = resp.map((metric) => {
        let metrics = metric.metrics;

        Object.keys(metrics).forEach((metric_key) => {
          if (!resultMetrics[metric.socialAccount]) {
            resultMetrics[metric.socialAccount] = {
              type: metric_key,
              metrics: []
            };
          }
          //  console.log("MK: " + metric_key);
          if (metric_key == "followers" || metric_key == "likes") {
            resultMetrics[metric.socialAccount].metrics.pushObject([
              new Date(metric.dateTime).valueOf(),
              metrics[metric_key]
            ]);
          }
        });
      });


      Object.keys(resultMetrics).forEach((socialAccountId) => {
        let data = {};
        const social = get(this, 'socialAccounts').findBy('id', socialAccountId);

        data['name'] = `${resultMetrics[socialAccountId].type} for ${get(social, 'title')}`;
        data['data'] = resultMetrics[socialAccountId].metrics.sort((a, b) => {
          return a[0] - b[0];
        });
        //  console.log(data['data']);

        graphData.pushObject(data);
      });

      if (get(this, 'isDestroyed') || get(this, 'isDestroying')) {
        return;
      }
      //  console.log(JSON.stringify(graphData));
      set(this, 'chartData', graphData);
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
