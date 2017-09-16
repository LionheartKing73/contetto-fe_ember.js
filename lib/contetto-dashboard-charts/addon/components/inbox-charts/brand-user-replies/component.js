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
  ajax: service(),
  store: service(),
  session: service(),

  fromDate: moment(new Date()).subtract(2, 'weeks').toDate(),
  endDate: moment(new Date()).toDate(),
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

  fetchChartData: task(function * () {
    const brandId = get(this, 'session.brand.id');

    const options = {
      data: {
        brand: brandId,
        fromDate: moment(get(this, 'fromDate')).utc().format(),
        endDate: moment(get(this, 'endDate')).utc().format()
      }
    };

    yield get(this, 'ajax').request('inbox/v1/replies', options).then((resp) => {
      const promise = resp.map((data) => {
        return this.get('store').fetchRecord('user', data['member_id']).then((user) => {
          return {
            name: user.get('fullName'),
            y: data['replies']
          };
        });
      });

      Ember.RSVP.all(promise).then((data) => {
        if (get(this, 'isDestroyed') || get(this, 'isDestroying')) {
          return;
        }

        set(this, 'chartData', [{
          name: 'User replies',
          data: data
        }]);
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
