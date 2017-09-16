import Ember from 'ember';
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

  fromDate: moment(new Date()).subtract(1, 'month').toDate(),
  endDate: moment(new Date()).add(2, 'weeks').toDate(),
  theme: contettoTheme,
  chartData: [],

  chartOptions: {
    chart: {
      zoomType: 'x',
      type: 'line'
    },
    title: {
      text: null,
    },
    xAxis: {
      type: 'datetime'
    },
    yAxis: {
      title: {
        text: 'Avg. assignment handling time'
      }
    },
  },

  didReceiveAttrs() {
    this.get('fetchChartData').perform();
  },

  fetchChartData: task(function * () {
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

    yield get(this, 'ajax').request('/departments/v1/reviewhandlingtime', options).then((resp) => {
      let groupedData = {};

      resp.forEach((dayData) => {
        dayData.data.forEach((deptData) => {
          if (groupedData[deptData['department_id']] === undefined) {
            groupedData[deptData['department_id']] = [];
          }

          groupedData[deptData['department_id']].pushObject([
            new Date(dayData['date']).valueOf(), deptData['averageHandlingTime']
          ]);
        });
      });

      let promises = Object.keys(groupedData).map((departmentId) => {
        return get(this, 'store').fetchRecord('department', departmentId).then((dept) => {

          return {
            name: `Avg. Handling time for ${dept.get('name')}`,
            data: groupedData[departmentId]
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
