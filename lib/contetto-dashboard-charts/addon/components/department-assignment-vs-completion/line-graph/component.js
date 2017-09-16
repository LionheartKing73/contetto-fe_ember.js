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
        text: 'No of posts completed'
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
      let data = [], groupedData = {};

      resp.forEach((dayData) => {
        dayData.data.forEach((deptData) => {
          if (groupedData[deptData['user_name']] === undefined) {
            groupedData[deptData['user_name']] = {
              'completions': [],
              'assignments': []
            };
          }

          groupedData[deptData['user_name']]['completions'].pushObject([
            new Date(dayData['date']).valueOf(), deptData['completions']
          ]);
          groupedData[deptData['user_name']]['assignments'].pushObject([
            new Date(dayData['date']).valueOf(), deptData['completions']
          ]);
        });
      });

      let promises = Object.keys(groupedData).map((userId) => {
        return get(this, 'store').fetchRecord('user', userId).then((user) => {

          return [{
            name: `Completions for ${user.get('fullName')}`,
            data: groupedData[userId]['completions']
          },{
            name: `Assignments for ${user.get('fullName')}`,
            data: groupedData[userId]['assignments']
          }];
        });
      });


      Ember.RSVP.all(promises).then((data) => {
        if (get(this, 'isDestroyed') || get(this, 'isDestroying')) {
          return;
        }

        let mergedData = [].concat.apply([], data);
        set(this, 'chartData', mergedData);
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
