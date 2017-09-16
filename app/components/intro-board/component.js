import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['introboard'],
  session: Ember.inject.service("session"),
  ajax: Ember.inject.service("ajax"),
  store: Ember.inject.service("store"),
  uid: function() {
    var d = new Date().getTime();

    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  },
  user: null,
  assignments: null,
  assigned: null,
  fnow: 0,
  fweek: 0,
  enow: 0,
  eweek: 0,

  engagementStatus: Ember.computed('enow', 'eweek', function() {


    if (this.get("enow") > this.get("eweek")) {
      return "success";
    } else if (this.get("enow") == this.get("eweek")) {
      return "warning";
    } else {
      return "danger";
    }
  }),
  engagementTitle: Ember.computed('enow', 'eweek', function() {


    if (this.get("enow") > this.get("eweek")) {
      return "Last 7 Days: Engagement Increased";
    } else if (this.get("enow") == this.get("eweek")) {
      return "Last 7 Days: Engagement";
    } else {
      return "Last 7 Days: Engagement Decreased";
    }
  }),
  engagementContent: Ember.computed('enow', 'eweek', function() {

    if (this.get("enow") > this.get("eweek")) {
      return "increased from " + this.get("eweek") + " to " + this.get("enow") + " interactions";
    } else if (this.get("enow") == this.get("eweek")) {
      return "remained " + this.get("enow") + " interactions";
    } else {
      return "decreased to " + this.get("enow") + " from " + this.get("eweek") + " interactions";
    }


  }),
  followerStatus: Ember.computed('fnow', 'fweek', function() {


    if (this.get("fnow") > this.get("fweek")) {
      return "success";
    } else if (this.get("fnow") == this.get("fweek")) {
      return "warning";
    } else {
      return "danger";
    }
  }),
  followerTitle: Ember.computed('fnow', 'fweek', function() {


    if (this.get("fnow") > this.get("fweek")) {
      return "Last 7 Days: Followers Increased";
    } else if (this.get("fnow") == this.get("fweek")) {
      return "Last 7 Days: Followers";
    } else {
      return "Last 7 Days: Followers Decreased";
    }
  }),
  followerContent: Ember.computed('fnow', 'fweek', function() {

    if (this.get("fnow") > this.get("fweek")) {
      return "increased from " + this.get("fweek") + " to " + this.get("fnow");
    } else if (this.get("fnow") == this.get("fweek")) {
      return "remained " + this.get("fnow");
    } else {
      return "decreased to " + this.get("fnow") + " from " + this.get("fweek");
    }


  }),
  todaypostsFooter: Ember.computed('todaypending.length', function() {
    return this.get("todaypending.length") + " pending approval";
  }),

  assignmentContent: Ember.computed('assignments.length', function() {
    var c = this.get("assignments.length") + " task";
    if (this.get("assignments.length") > 1) {
      c += "s";
    }
    return c;
  }),
  assignmentFooter: Ember.computed('myoverdue.length', function() {
    var c = this.get("myoverdue.length");
    if (this.get("myoverdue.length") == 1) {
      c += " is ";
    } else {
      c += " are ";
    }
    c += "overdue";
    return c;

  }),
  assignedContent: Ember.computed('assigned.length', function() {
    var c = this.get("assigned.length") + " pending task";
    if (this.get("assigned.length") > 1) {
      c += "s";
    }

    return c;
  }),
  assignedFooter: Ember.computed('overdue.length', function() {
    var c = this.get("overdue.length") + " overdue.";
    //length 1)}}is{{else}}are{{/if}} overdue</strong>{{#if duetoday.length}},{{/if}}{{/if}}{{#if duetoday.length}} {{duetoday.length}} {{#if (eq duetoday.length 1)}}is{{else}}are{{/if}} due in the next 24 hours.{{/if}}
    return c;


  }),
  inboxitems: Ember.computed('inbox.@each', function() {
    return this.get('inbox').filter(item => item.get('archive') == false);
  }),
  inbox: [],
  todayslots: Ember.computed('slots.@each', function() {
    return this.get('slots').filter(item => item.dateTime > moment() && item.dateTime < moment().add(1, 'day'));
  }),
  weekslots: Ember.computed('slots.@each', function() {
    return this.get('slots').filter(item => item.dateTime > moment() && item.dateTime < moment().add(1, 'week'));
  }),
  todayposts: Ember.computed('schedules.@each', function() {
    return this.get('schedules').filter(item => item.get('scheduledTime') > moment() && item.get("scheduledTime") < moment().add(2, 'day'));
  }),
  todaypending: Ember.computed('schedules.@each', function() {
    return this.get('schedules').filter(item => item.get('scheduledTime') > moment() && item.get("scheduledTime") < moment().add(2, 'day') && item.get("posting.postingStatus.id") == 4);
  }),
  recentposts: Ember.computed('schedules.@each', function() {
    return this.get('schedules').filter(item => item.get('scheduledTime') < moment() && item.get("scheduledTime") > moment().subtract(2, 'day') && item.get("posting.postingStatus.id") == 1);
  }),
  myoverdue: Ember.computed('assignments.@each', function() {
    return this.get('assignments').filter(item => item.get('requestDue') < moment());
  }),
  overdue: Ember.computed('assigned.@each', function() {
    return this.get('assigned').filter(item => item.get('requestDue') < moment());
  }),
  duetoday: Ember.computed('assigned.@each', function() {
    return this.get('assigned').filter(item => item.get('requestDue') > moment() && item.get("requestDue") < moment().add(1, "day"));
  }),


  assignedDetails: Ember.computed('overdue', function() {
    if (this.get("overdue.length") > 0 || this.get("duetoday.length") > 0) {
      return true;
    }
    return false;
  }),
  didInsertElement() {

    Ember.run.once(this, 'boot');
  },
  boot() {
    var self = this;
    this.get("store").fetchRecord("user", this.get("session.data.authenticated.userId")).then((user) => {
      self.set("user", user);
    });


    this.get("store").query("changeRequest", {
      'assignedToUser': this.get('session.data.authenticated.userId'),
      'status': 1,
      'brand': this.get("session.brand.id")
    }).then((a) => {
      if (!(self.get('isDestroyed') || self.get('isDestroying'))) {
        self.set("assignments", a);
      }
    });

    this.get("store").query("changeRequest", {
      'requestBy': this.get('session.data.authenticated.userId'),
      'status': 1,
      'brand': this.get("session.brand.id")
    }).then((a) => {
      if (!(self.get('isDestroyed') || self.get('isDestroying'))) {
        self.set("assigned", a);
      }
    });

    if (this.get('session.currentBrandRole.viewInbox')) {
      this.getInbox();
    }

    this.getSlots();

    this.getSchedules();

    this.get("ajax").request("https://gke.contetto.io/social-accounts/v1/pageMetricsDates?brand=" + self.get("session.brand.id") + "&date1=" + moment().subtract(1, 'week').utc().format() + "&date2=" + moment().utc().format()).then((response) => {
      if (!(self.get('isDestroyed') || self.get('isDestroying'))) {
        self.set("fnow", response.date2);
        self.set("fweek", response.date1);
      }
    });

    this.get("ajax").request("https://gke.contetto.io/social-accounts/v1/pageEngagementDates?brand=" + self.get("session.brand.id") + "&date1=" + moment().subtract(1, 'week').utc().format() + "&date2=" + moment().utc().format()).then((response) => {
      if (!(self.get('isDestroyed') || self.get('isDestroying'))) {
        self.set("enow", response.date2);
        self.set("eweek", response.date1);
      }
    });
  },
  getInbox() {
    var self = this;
    this.get("store").query("inboxItem", {
      'brand': this.get('session.brand.id'),
      'limit': 1000,
      'fromDate': moment().subtract(6, "month").utc().set({
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0
      }).format(),
      'archive': false,
      'endDate': moment().add(1, "day").utc().set({
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0
      }).format()
    }).then((items) => {
      if (!(self.get('isDestroyed') || self.get('isDestroying'))) {
        self.set("inbox", []);
        items.map(function(item) {
          self.get("inbox").pushObject(item);
        });
      }
    });

  },
  schedules: [],
  getSchedules() {
    var self = this;

    var params = {
      brand: this.get("session.brand.id"),
      fromDate: moment().subtract(14, 'day').utc().format(),
      endDate: moment().add(14, 'day').utc().format()
    };
    this.get("store").query("posting-schedule", params).then((schedules) => {
      if (!(self.get('isDestroyed') || self.get('isDestroying'))) {
        self.set("schedules", []);
        schedules.map(function(s) {

          self.get("schedules").pushObject(s);
        });
      }
    });

  },
  slotEvent: [],
  slots: [],
  getSlots() {
    /*global moment */
    var self = this;

    var tsa = this.get("session.brand.socialAccounts").toArray().map(function(item) {
      return item.get("id");
    }).join(",");
    this.set("slotEvents", []);

    this.get("ajax").request("https://gke.contetto.io/postings/v1/accountFreeSlots?socialAccounts=" + tsa + "&fromDate=" + moment().subtract(1, 'day').utc().format() + "&endDate=" + moment().add(14, 'day').utc().format()).then((resp) => {
      if (!(this.get('isDestroyed') || this.get('isDestroying'))) {
        this.set("slotEvents", []);

        if (resp.length > 0) {
          Ember.RSVP.all(resp.map(function(tslot) {
            return self.get("store").fetchRecord("socialAccount", tslot.socialAccount).then((tsa) => {
              return self.get("store").fetchRecord("networkType", tslot.networkType).then((nt) => {

                var event = {
                  'id': self.uid(),
                  'start': tslot.dateTime,
                  'postingId': "freeslot",
                  'dateTime': moment(tslot.dateTime),
                  'socialAccount': tsa,
                  'networkType': nt,
                  'className': ["freeSlot"]
                };
                self.get("slotEvents").push(event);
              });
            });
          })).then(function() {
            self.set("slots", self.get("slotEvents"));
          });
        }
      }
    });
  },
  actions: {
    inbox() {
      this.get("router").transitionTo('brand.edit.inbox', this.get("session.company.id"), this.get("session.brand.id"));
    }
  }

});
