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
  ajax: service(),
  session: service(),

  fromDate: moment(new Date()).subtract(1, 'month').toDate(),
  endDate: moment(new Date()).add(2, 'weeks').toDate(),
  theme: contettoTheme,
  chartData: [],

  chartOptions: {
    chart: {
      type: 'column'
    },
    title: {
      text: null
    },
    xAxis: {
      categories: [
        'Assigned',
        'Completed'
      ],
    },
    yAxis: {
      allowDecimals: false,
      title: {
        text: 'No. of posts'
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

    yield get(this, 'ajax').request('/postings/v1/departmentReviewRequests', options).then((resp) => {
      let graphData = [];

      let groupedData = groupBy(resp, 'department_id');

      Object.keys(groupedData).forEach((dep_id) => {
        let data = groupedData[dep_id].get('firstObject');
        let deptData = {
          name: data.department_name,
          data: [data.requests, data.completions]
        }

        graphData.pushObject(deptData);
      });

      if (get(this, 'isDestroyed') || get(this, 'isDestroying')) {
        return;
      }

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
