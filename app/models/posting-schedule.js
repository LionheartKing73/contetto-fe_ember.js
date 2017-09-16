import DS from "ember-data";
import Ember from "ember";
const {
  attr,
  belongsTo,
  hasMany
} = DS;

export default DS.Model.extend({
  socialAccount: belongsTo('socialAccount'),
  now: attr('to-boolean'),
  dateTime: attr('utc-date'),
  tempTime: attr('utc-date'),
  createdTime: attr('utc-date'),
  externalUrl: attr('string'),
  postedTime: attr('utc-date'),
  offset: attr('number'),
  offsetType: belongsTo('offsetType'),
  friendlyOffsetName: Ember.computed('offset', 'offsetType.name', function() {

    if (this.get("offsetType.name") == "Immediate") {
      return "Immediate";
    }
    if (this.get("offsetType.name") == "Minute") {
      if (this.get("offset") > 1) {
        return this.get("offset") + " Minutes";
      }
      return this.get("offset") + " Minute";
    }
    if (this.get("offsetType.name") == "Hour") {
      if (this.get("offset") > 1) {
        return this.get("offset") + " Hours";
      }
      return this.get("offset") + " Hour";
    }
    if (this.get("offsetType.name") == "Day") {
      if (this.get("offset") > 1) {
        return this.get("offset") + " Days";
      }
      return this.get("offset") + " Day";
    }
    if (this.get("offsetType.name") == "Week") {
      if (this.get("offset") > 1) {
        return this.get("offset") + " Weeks";
      }
      return this.get("offset") + " Week";
    }
    if (this.get("offsetType.name") == "Month") {
      if (this.get("offset") > 1) {
        return this.get("offset") + " Months";
      }
      return this.get("offset") + " Month";
    }

  }),
  posting: belongsTo('posting', {
    "inverse": "postingSchedules",
    "async": false
  }),
  isPosted: attr('to-boolean'),
  postingScheduleMode: belongsTo('postingScheduleMode'),
  channelStep: belongsTo('channelStep'),
  reviewChannelApproved: attr('to-boolean'),
  platform: Ember.computed('posting', {get() {
      return this.get('socialAccount.platform');
    }
  }),

  title: Ember.computed('posting', {get() {
      return this.get('platform') + " " + this.get("posting.topic");
    }
  }),
  start: Ember.computed('dateTime', {get() {
      return this.get("dateTime");
    }
  }),
  campaign: Ember.computed('posting', function() {
    return this.get('posting.campaign');
  }),
  scheduledTime: Ember.computed('dateTime', 'tempTime', 'createdTime', function() {
    if (this.get('dateTime')) {
      return this.get('dateTime');
    }
    else if (this.get('tempTime')) {
      return this.get('tempTime');
    }
    else {
      return this.get('createdTime');
    }
  }),
  validStartOutbox: Ember.computed('dateTime', 'tempTime', 'postedTime', function(){
    var start = "";
    if ((this.get('dateTime') != "Invalid date" && this.get('dateTime') != null && this.get('dateTime') != "") || (this.get('tempTime') != null && this.get('tempTime') != "")) {
      if (this.get('postedTime') != "" && this.get('postedTime') != undefined) {
        start = this.get('postedTime');
      }
      if (this.get('dateTime') != "" && this.get('dateTime') != null && this.get('dateTime') != undefined) {
        start = this.get('dateTime');
      } else {
        start = this.get('tempTime');
      }
    }
    return moment(start).isValid();
  }),
  isInOutboxRange: Ember.computed('dateTime', 'tempTime', function(){
    let fromDate = new Date(moment().utc().format());
    let endDate = new Date(moment().add(1, 'month').utc().format());
    if(this.get('dateTime')){
      return this.get("dateTime").toDate()>=fromDate && this.get("dateTime").toDate()<=endDate;
    }
    if(this.get('tempTime')){
      return this.get("tempTime").toDate()>=fromDate && this.get("tempTime").toDate()<=endDate;
    }
    return false;
  })
});
