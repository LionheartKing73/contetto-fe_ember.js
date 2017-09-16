import Ember from 'ember';

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
  chartData: [],

  chartOptions: Ember.computed('xlabel', 'ylabel', 'title', {get() {
      return {
        chart: {
          zoomType: 'x',
          type: 'line'
        },
        title: {
          text: this.get("title")
        },
        xAxis: {
          type: 'datetime',
          title: {
            text: this.get("xlabel")
          }
        },
        yAxis: {
          title: {
            text: this.get("ylabel")
          }
        }
      };
    }
  }),

  didReceiveAttrs() {
    this.get('fetchChartData').perform();
  },
  s: [],
  fetchChartData: task(function*() {
    const brandId = get(this, 'session.brand.id');

    if (!brandId) {
      return;
    }

    const options = {
      data: {
        startDate: moment(get(this, 'fromDate')).utc().format(),
        endDate: moment(get(this, 'endDate')).utc().format()
      }
    };
    var self = this;
    yield get(this, 'ajax').request(this.get('url'), options).then((resp) => {
      set(this, 'xlabel', resp.xlabel);
      set(this, 'ylabel', resp.ylabel);
      set(this, 'title', resp.title);
      set(this, 'chartData', this.metrics(resp));
    });
  }),
  metrics(resp) {
    var out = [];
    for (var i = 0; i < resp.metricNames.length; i++) {
      var item = resp.metricNames[i];
      var thisData = this.metricData(item, resp);
      out.push({
        'name': item,
        'data': thisData
      });
    }
    return out;
  },
  metricData(mn, resp) {
    var out = [];
    for (var i = 0; i < resp.data.length; i++) {
      var item = resp.data[i];
      if (item.metricName == mn) {
        out.push([new Date(item.xvalue).valueOf(), item.yvalue]);
      }
    }
    return out;
  },
  actions: {
    setFromDate(date) {
      set(this, 'fromDate', date);
    },
    setEndDate(date) {
      set(this, 'endDate', date);
    },
    refreshChart(){
      this.get('fetchChartData').perform();
    }
  }
});
