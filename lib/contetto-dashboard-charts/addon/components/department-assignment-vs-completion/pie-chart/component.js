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

  fromDate: moment(new Date()).toDate(),
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

  fetchChartData: task(function * () {
    const departmentId = get(this, 'department.id');

    const options = {
      data: {
        department: departmentId,
        fromDate: moment(get(this, 'fromDate')).utc().format(),
        endDate: moment(get(this, 'endDate')).utc().format()
      }
    };

    yield get(this, 'ajax').request('/postings/v1/membersReviewRequests', options).then((resp) => {
      let series = {
        name: 'Post Created by',
        colorByPoint: true
      }, userData = {};

      resp.forEach((deptData) => {
        deptData.data.forEach((memberData) => {
          if (userData[memberData['user_name' ]] === undefined) {
            userData[memberData['user_name']] = 0
          }

          userData[memberData['user_name']] =  userData[memberData['user_name']] + memberData['completions'];
        });
      });

      let promises = Object.keys(userData).map((userId) => {
        return get(this, 'store').fetchRecord('user', userId).then((user) => {
          return {
            name: `${user.get('fullName')}`,
            y: userData[userId]
          };
        });
      });

      Ember.RSVP.all(promises).then((data) => {
        if (get(this, 'isDestroyed') || get(this, 'isDestroying')) {
          return;
        }

        series.data = data;

        set(this, 'chartData', [series]);
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
