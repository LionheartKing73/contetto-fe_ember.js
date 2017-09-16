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
  session: service(),

  fromDate: moment(new Date()).subtract(2, 'weeks').toDate(),
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
      allowDecimals: false,
      title: {
        text: 'Total no. of inbox action types'
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

    yield get(this, 'ajax').request('inbox/v1/stats', options).then((resp) => {
      let graphData = [],
          direct_messages = [],
          posts = [],
          replies = [],
          comments = [],
          mentions = [];

      let groupedData = groupBy(resp, 'date');

      Object.keys(groupedData).forEach((date) => {
        let data = groupedData[date].get('firstObject')['data'];

        direct_messages.pushObject([
          new Date(date).valueOf(),
          data['direct_messages']
        ]);
        posts.pushObject([
          new Date(date).valueOf(),
          data['posts']
        ]);
        replies.pushObject([
          new Date(date).valueOf(),
          data['replies']
        ]);
        comments.pushObject([
          new Date(date).valueOf(),
          data['comments']
        ]);
        mentions.pushObject([
          new Date(date).valueOf(),
          data['mentions']
        ]);
      });

      if (get(this, 'isDestroyed') || get(this, 'isDestroying')) {
        return;
      }

      set(this, 'chartData', [{
        name: "Direct Messages",
        data: direct_messages.sort((a, b) => {
          return a[0] - b[0];
        })
      },{
        name: "Posts",
        data: posts.sort((a, b) => {
          return a[0] - b[0];
        })
      }, {
        name: "Replies",
        data: replies.sort((a, b) => {
          return a[0] - b[0];
        })
      }, {
        name: "Comments",
        data: comments.sort((a, b) => {
          return a[0] - b[0];
        })
      }, {
        name: "Mentions",
        data: mentions.sort((a, b) => {
          return a[0] - b[0];
        })
      }]);
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
