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
  tooltip() {
    if (this.get("combined") == "yes") {
      return {
        crosshairs: true,
        shared: true
      };
    }
    else {
      return {
        crosshairs: true,
      };
    }
  },
  chartOptions: Ember.computed('xaxis', 'yaxis', 'title', 'chart', 'tooltip', {get() {
      return {



        tooltip: this.tooltip(),
        title: this.get("title"),
        xAxis: this.get("xaxis"),
        yAxis: this.get("yaxis"),
        chart: this.get("chart")
      };
    }
  }),

  init() {
    this._super();
    this.set("chat", {});
    this.set("s", []);
    this.set("chartData", []);
    this.set("resp", "");
  },
  didReceiveAttrs() {
    this.get('fetchChartData').perform();
  },
  chart: {},
  s: [],
  fetchChartData: task(function*() {
    /* global moment */
    const brandId = get(this, 'session.brand.id');

    if (!brandId) {
      return;
    }

    var options = {};

    if (this.get("hideRange")) {}
    else {
      options = {
        data: {
          startDate: moment(get(this, 'fromDate')).utc().format(),
          endDate: moment(get(this, 'endDate')).utc().format()
        }
      };
    }

    var self = this;

    yield get(this, 'ajax').request(this.get('url'), options).then((resp) => {

      set(this, 'xaxis', resp.xAxis);
      set(this, 'yaxis', resp.yAxis);
      set(this, 'title', resp.title);
      set(this, 'chart', resp.chart);
      set(this, 'chartData', resp.series);
      self.set("resp", JSON.stringify(resp));
    });
  }),
  resp: "",
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
