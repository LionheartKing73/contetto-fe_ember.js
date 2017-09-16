import Ember from 'ember';
import OneWaySelect from 'ember-one-way-controls/components/one-way-select';
import { invokeAction } from 'ember-invoke-action';

const {
  get
} = Ember;

export default OneWaySelect.extend({
  optionValuePath: 'id',
  optionLabelPath: 'name',
  classNames: "form-control",
  options: [
    { id: 0, name: "Don't Summarize" },
    { id: 5, name: "5 Minutes" },
    { id: 10, name: "10 Minutes" },
    { id: 15, name: "15 Minutes" },
    { id: 20, name: "20 Minutes" },
    { id: 25, name: "25 Minutes" },
    { id: 30, name: "30 Minutes" },
    { id: 60, name: "1 Hour" },
    { id: 120, name: "2 Hours" },
    { id: 180, name: "3 Hours" },
    { id: 240, name: "4 Hours" },
    { id: 300, name: "5 Hours" },
    { id: 360, name: "6 Hours" },
    { id: 720, name: "12 Hours" },
    { id: 1440, name: "24 Hours" },
  ],

  change() {
    let value;

    if (get(this, 'multiple') === true) {
      value = this._selectedMultiple();
    } else {
      value = this._selectedSingle();
    }

    invokeAction(this, 'update', value.id);
  },
});
