import Ember from 'ember';
import OneWaySelect from 'ember-one-way-controls/components/one-way-select';
import {
  invokeAction
}
from 'ember-invoke-action';

const {
  get
} = Ember;

export default OneWaySelect.extend({
  optionValuePath: 'id',
  optionLabelPath: 'name',
  classNames: "form-control",
  options: [{
    id: 0,
    name: "Not set"
  }, {
    id: 1,
    name: "1 Hour"
  }, {
    id: 2,
    name: "2 Hours"
  }, {
    id: 5,
    name: "5 Hours"
  }, {
    id: 10,
    name: "10 Hours"
  }, {
    id: 15,
    name: "15 Hours"
  }, {
    id: 20,
    name: "20 Hours"
  }, {
    id: 24,
    name: "1 Day"
  }, {
    id: 48,
    name: "2 Days"
  }, {
    id: 72,
    name: "3 Days"
  }, {
    id: 96,
    name: "4 Days"
  }, {
    id: 120,
    name: "5 Days"
  }, {
    id: 144,
    name: "6 Days"
  }, {
    id: 168,
    name: "1 Week"
  }, {
    id: 336,
    name: "2 Weeks"
  }, {
    id: 720,
    name: "1 Month"
  }, {
    id: 1440,
    name: "2 Months"
  }, {
    id: 2160,
    name: "3 Months"
  }, {
    id: 4320,
    name: "6 Months"
  }, {
    id: 8640,
    name: "1 Year"
  }, ],

  change() {
    let value;

    if (get(this, 'multiple') === true) {
      value = this._selectedMultiple();
    }
    else {
      value = this._selectedSingle();
    }

    invokeAction(this, 'update', value.id);
  },
});
