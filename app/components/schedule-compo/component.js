import Ember from 'ember';

export default Ember.Component.extend({
  /*FullCalendar config vars*/
  views: {
    listDay: {
      buttonText: 'list day'
    },
    listWeek: {
      buttonText: 'list week'
    }
  },
  header: {
    left: 'prev,next today waitList',
    center: 'title',

    right: 'agendaWeek,agendaDay,listDay,listWeek,listMonth,month'
  },
  eventStartEditable: true,
  quickedit: [],
  slotDuration: '00:15:00',
  defaultTimedEventDuration: '00:15:00',
  visStart: null,
  visEnd: null,
  selectable: false,
  /*Component vars*/
  selectedTZ: null,
  store: Ember.inject.service('store'),
  ajax: Ember.inject.service('ajax'),
  session: Ember.inject.service('session'),
  eventsFetch: Ember.computed('selectedAccounts',
    'selectedNetworkTypes',
    'selectedCampaigns', 'selectedCategories',
    'selectedTags', 'selectedDraft', 'selectedStatus', 'selectedUsers', 'selectedTZ', 'selectedAuto', 'visEnd', {
      get() {
        if (this.get("selectedTZ") != null && this.get("visStart") != null && this.get("visEnd") != null) {
          Ember.run.debounce(this, "updateEvents", 200);

        }
      }
    }),
  init: function() {
    this._super();
    //        alert("hi");
    Ember.run.once(this, "doClearFilters", true);
  },
  didUpdateAttrs: function() {

  },
  clearSelected(){
    this.set('draftSelected', false);
    this.set('sendingSelected', false);
    this.set('reviewSelected', false);
    this.set('sentSelected', false);
  },
  didInsertElement: function() {
    this.clearSelected();
  },
  presetFilters: function() {
    if (!Ember.isEmpty(this.get("campaign.id"))) {
      this.get("selectedCampaigns").pushObject(this.get("campaign"));
    }

    if (!Ember.isEmpty(this.get("user"))) {
      this.get("selectedUsers").pushObject(this.get("user"));
    }

    if (!Ember.isEmpty(this.get("post"))) {
      self.get("quickedit").pushObject(this.get("post"));
    }
  },
  campaignSlotEvents: [],
  generateCampaignPosts() {
    var self = this;
    self.set("campaignSlotEvents", []);
    this.get("ajax").request("https://gke.contetto.io/postings/v1/campaignFreeSlots?campaign=" + this.get("campaign.id")).then((resp) => {
      self.set("campaignSlotEvents", []);
      if (resp.length > 0) {


        if (resp.length > 0) {
          Ember.RSVP.all(resp.map(function(tslot) {
            return self.get("store").fetchRecord("socialAccount", tslot.socialAccount).then((tsa) => {
              //  console.log(tslot);

              return self.get("store").fetchRecord("networkType", tslot.networkType).then((nt) => {
                var start = moment(tslot.dateTime).tz(self.get('selectedTZ')).format();
                var event = {
                  'id': self.uid(),
                  'start': start,
                  'title': '<i class="fa fa-' + tsa.get("platform") + '"></i>' + " " + tsa.get('title') + ': ' + nt.get('name'), // + '<br/><strong>Schedule Mode</strong>: ' + sm + '<br/><strong>Status:</strong> ' + statusName + '<BR/>' + posting.get('topic') + createdBy + '<BR/>' + moment(start).format('MMM-Do h:mm a') + totalAccounts;
                  'postingId': "freeslot",
                  'dateTime': tslot.dateTime,
                  'socialAccount': tsa,
                  'networkType': nt,
                  'className': ["campaignSlot"]
                };
                self.get("campaignSlotEvents").push(event);
              });
            });
          })).then(function() {
            Ember.$('.full-calendar').fullCalendar('renderEvents', self.get("campaignSlotEvents"), true);
          });
        }
      }
    });
  },
  updateEvents: function() {

    Ember.$('.full-calendar').fullCalendar('removeEvents');
    if (!this.get("generate")) {
      Ember.run.once(this, "getFreeSlots");
    } else {
      Ember.run.once(this, "generateCampaignPosts");
    }
    var component = this;
    return this.get("store").query("posting-schedule", this.queryParams().data).then((schedules) => {
      if (!Ember.isEmpty(schedules)) {
        schedules.map(function(schedule) {
          if ((schedule.get('dateTime') != "Invalid date" && schedule.get('dateTime') != null && schedule.get('dateTime') != "") || (schedule.get('tempTime') != null && schedule.get('tempTime') != "")) {
            var start = "";
            var sm = "Specified Date/Time";
            if (schedule.get('postedTime') != "" && schedule.get('postedTime') != undefined) {
              start = schedule.get('postedTime');
              sm = "Posted";
            }
            if (schedule.get('dateTime') != "" && schedule.get('dateTime') != null && schedule.get('dateTime') != undefined) {
              start = schedule.get('dateTime');
              sm = "Manually Specified";
            } else {
              start = schedule.get('tempTime');
              sm = "Automatic/Calculated";
            }

            /*global moment*/
            if (moment(start).isValid()) {
              start = moment(start).tz(component.get('selectedTZ')).format();
              component.get('store').fetchRecord('posting', schedule.get('posting.id')).then((posting) => {
                component.get("store").fetchRecord("networkType", posting.get("networkType.id")).then((ntn) => {
                  component.get('store').fetchRecord('socialAccount', schedule.get('socialAccount.id')).then((sa) => {
                    var statusName = null;
                    if (posting.get("postingStatus")) {
                      statusName = posting.get('postingStatus.cleanName');
                    }
                    if (statusName == null || statusName == undefined || statusName == "") {
                      statusName = "Pending Content*";

                    }
                    var createdBy = "";
                    if (posting.get("user.id") != null) {
                      createdBy = "<BR/><strong>Created by:</strong> " + posting.get("user.fullName");
                    }
                    var totalAccounts = "";
                    if (posting.get("postingSchedules.length") > 1) {
                      totalAccounts = "<BR/><BR/>Posting to " + posting.get("postingSchedules.length") + " total accounts.";
                    }
                    var title = '<i class="fa fa-' + sa.get("platform") + '"></i>' + " " + sa.get('title') + ': ' + posting.get('networkType.name') + '<br/><strong>Schedule Mode</strong>: ' + sm + '<br/><strong>Status:</strong> ' + statusName + '<BR/>' + posting.get('topic') + createdBy + '<BR/>' + moment(start).format('MMM-Do h:mm a') + totalAccounts;
                    var draftStatus = 'notDraft';
                    if (posting.get('isDraft')) {
                      draftStatus = 'isDraft';
                    }
                    var df = 'pastItem';
                    if (moment() < moment(start)) {
                      df = 'futureItem';
                    }
                    var event = {
                      'id': schedule.get('id'),
                      'start': start,
                      'title': title,
                      'postingId': posting.get('id'),
                      'scheduleId': schedule.get('id'),
                      'className': [sa.get("platform"), posting.get('networkType.name'), posting.get('postingStatus.name'), draftStatus, sm.replace('/', '').replace(' ', ''), df]
                    };
                    //  console.log(JSON.stringify(event));
                    Ember.$('.full-calendar').fullCalendar('renderEvent', event, true);
                  });
                });
              });
            } else {
              // console.log("Moment rejected...");
            }
          } else {
            // console.log("Reject event!");
          }
        });
      }

      return schedules;
    });
  },
  events: [],
  temps: [],
  params: Ember.computed('selectedAccounts',
    'selectedNetworkTypes',
    'selectedCampaigns', 'selectedCategories',
    'selectedTags', 'selectedDraft', 'selectedStatus', 'selectedUsers', 'selectedAuto', {
      get() {
        return this.queryParams();
      }
    }),
  queryParams: function() {
    var params = {
      data: {
        brand: this.get("brand.id"),
        fromDate: this.get("visStart").utc().format(),
        endDate: this.get("visEnd").utc().format(),

      }
    };
    if (this.get("selectedAccounts.length") > 0) {
      params.data.socialAccounts = this.get("selectedAccounts").toArray().map(function(item) {
        return item.id;
      }).join(',');
    }
    if (this.get("selectedNetworkTypes.length") > 0) {
      params.data.networkTypes = this.get("selectedNetworkTypes").toArray().map(function(item) {
        return item.id;
      }).join(',');
    }
    if (this.get("selectedCampaigns.length") > 0) {
      params.data.campaigns = this.get("selectedCampaigns").toArray().map(function(item) {
        return item.id;
      }).join(',');
    }
    if (this.get("selectedCategories.length") > 0) {
      params.data.categories = this.get("selectedCategories").toArray().map(function(item) {
        return item.id;
      }).join(',');
    }
    if (this.get("selectedTags.length") > 0) {
      params.data.tagIds = this.get("selectedTags").toArray().map(function(item) {
        return item.id;
      }).join(',');
    }
    if (this.get("selectedDraft") != "all") {
      params.data.isDraft = this.get("selectedDraft");
    }
    if (this.get("selectedAuto") != "all") {
      params.data.isAuto = this.get("selectedAuto");
    }
    if (this.get("selectedStatus.length") > 0) {
      params.data.statuses = this.get("selectedStatus").toArray().map(function(item) {
        return item.id;
      }).join(',');
    }
    if (this.get("selectedUsers.length") > 0) {
      params.data.users = this.get("selectedUsers").toArray().map(function(item) {
        return item.id;
      }).join(',');
    }
    return params;
  },
  sa() {
    var sa = "";
    if (this.get("selectedAccounts.length") > 0) {
      sa = this.get("selectedAccounts").toArray();
    } else {
      sa = this.get("brand.socialAccounts").toArray();
    }
    return sa;
  },
  getFreeSlots() {
    var self = this;
    var fromDate = this.get("visStart").utc().format();
    var endDate = this.get("visEnd").utc().format();
    var sa = this.sa();

    Ember.run.once(this, "getSlots", sa.map(function(item) {
      return item.get("id");
    }).join(","));

  },
  slotEvents: [],
  getSlots(tsa) {
    var self = this;
    var fromDate = this.get("visStart").utc().format();
    var endDate = this.get("visEnd").utc().format();
    this.set("slotEvents", []);
    this.get("ajax").request("https://gke.contetto.io/postings/v1/accountFreeSlots?socialAccounts=" + tsa + "&fromDate=" + fromDate + "&endDate=" + endDate).then((resp) => {
      this.set("slotEvents", []);

      if (resp.length > 0) {
        Ember.RSVP.all(resp.map(function(tslot) {
          return self.get("store").fetchRecord("socialAccount", tslot.socialAccount).then((tsa) => {
            //    console.log(tslot);

            return self.get("store").fetchRecord("networkType", tslot.networkType).then((nt) => {
              var start = moment(tslot.dateTime).tz(self.get('selectedTZ')).format();
              var event = {
                'id': self.uid(),
                'start': start,
                'title': '<i class="fa fa-' + tsa.get("platform") + '"></i>' + " " + tsa.get('title') + ': ' + nt.get('name'), // + '<br/><strong>Schedule Mode</strong>: ' + sm + '<br/><strong>Status:</strong> ' + statusName + '<BR/>' + posting.get('topic') + createdBy + '<BR/>' + moment(start).format('MMM-Do h:mm a') + totalAccounts;
                'postingId': "freeslot",
                'dateTime': tslot.dateTime,
                'socialAccount': tsa,
                'networkType': nt,
                'className': ["freeSlot"]
              };
              self.get("slotEvents").push(event);
            });
          });
        })).then(function() {
          Ember.$('.full-calendar').fullCalendar('renderEvents', self.get("slotEvents"), true);
        });
      }
    });
  },
  selectedAccounts: [],
  selectedNetworkTypes: [],
  selectedCampaigns: [],
  selectedCategories: [],
  selectedTags: [],
  selectedDraft: "all",
  selectedStatus: [],
  selectedUsers: [],
  selectedAuto: "all",
  bulkEditor: false,
  quickposts: [],
  premade: [],
  doClearFilters: function(presetFilters) {
    // console.log("CLEAR!!!");
    this.set("quickposts", []);
    this.set("temps", []);
    this.set("quickedit", []);
    this.set("selectedAccounts", []);
    this.set("selectedNetworkTypes", []);
    this.set("selectedCampaigns", []);
    this.set("selectedCategories", []);
    this.set("selectedTags", []);
    this.set("selectedDraft", "all");
    this.set("selectedStatus", []);
    this.set("selectedUsers", []);
    this.set("selectedAuto", "all");
    this.set("premade", []);
    if (presetFilters) {
      this.presetFilters();
    }
    this.set('draftSelected', false);
    this.set('sendingSelected', false);
    this.set('reviewSelected', false);
    this.set('sentSelected', false);
  },
  uid: function() {
    var d = new Date().getTime();

    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  },
  tempEvent(item) {
    var events = Ember.$('.full-calendar').fullCalendar('clientEvents', item.get("tempID"));
    return events[0];

  },
  constructTemp(item) {
    //  alert("Construct");
    var start = moment();
    if (item.get("dateTime") != null) {
      start = item.get("dateTime");
    } else {
      if (item.get("tempTime") != null) {
        start = item.get("tempTime");
      }
    }
    start = moment(start).tz(this.get('selectedTZ')).format();

    var event = {
      'id': item.get("tempID"),
      'start': start,
      'title': '<i class="fa fa-' + item.get("socialAccount.platform") + '"></i>' + " " + item.get('socialAccount.title') + ': ' + item.get('posting.networkType.name'), // + '<br/><strong>Schedule Mode</strong>: ' + sm + '<br/><strong>Status:</strong> ' + statusName + '<BR/>' + posting.get('topic') + createdBy + '<BR/>' + moment(start).format('MMM-Do h:mm a') + totalAccounts;
      'postingId': "temp",
      'className': ["tempItem"]
    };
    Ember.$('.full-calendar').fullCalendar('renderEvent', event);

  },
  updateTemp(item, event) {
    //  alert("Update");
    var start = moment();
    if (item.get("dateTime") != null) {
      start = item.get("dateTime");
    } else {
      if (item.get("tempTime") != null) {
        start = item.get("tempTime");
      }
    }
    start = moment(start).tz(this.get('selectedTZ')).format();

    event.start = start;
    return event;
  },
  actions: {
    selectTime: function(start, end, jsEvent, view) {
      var self = this;
      if (view.name != "month") {

        const myTime = moment(start);
        var myTime2 = myTime.add(((moment().utcOffset() - myTime.utcOffset()) * -1), 'minutes');
        var d2 = myTime2;
        //  alert("Now " + moment().utc().format() + "/" + moment().format("Z") + " - Selected: " + moment(start).utc().format() + "/" + moment(start).format("Z") + " - MT: " + moment(myTime2).utc().format() + "/" + moment(myTime2).format("Z"));
        //                var d1 = myTime.utc().add((moment().utcOffset() * -1), 'minutes');
        //              var d2 = moment.tz(myTime.utc().add((moment().utcOffset() * -1), 'minutes').format('YYYY-MM-DDTHH:mm:ss'), 'YYYY-MM-DDTHH:mm:ss', self.get('selectedTZ'));
        //            alert("Now: " + moment().utc().format() + "D1: " + moment(d1).utc().format() + " Start: " + moment(start).utc().format() + "start: " + moment(start).format() + " D2utc: " + moment(d2).utc().format() + " d2 " + moment(d2).format() + " d2 offset" + moment(d2).utcOffset() + " start offset" + moment(start).utcOffset() + " moment offset: " + moment().utcOffset());
        if (moment(d2).utc() > moment().utc()) {



          //     alert(moment(start).format() + " utc: " + moment(start).utc().format() + " selected " + moment(start).tz(self.get('selectedTZ')).format() + " another: " + moment(start).tz(self.get('selectedTZ')).format() + " stdz: " + d2.format());
          //  alert("Select! " + start + " - " + end + " / " + view.name);
          var record = this.get("store").createRecord("posting", {
            "brand": this.get("brand"),
            "firstTempStart": d2.format()
          });
          this.get("quickposts").pushObject(record);
        }
      }
    },
    eventDrop: function(event, delta, revertFunc) {
      if (event.postingId == "temp" || event.postingId == "freeslot") {
        revertFunc();
        return;
      }


      this.get('store').fetchRecord('postingSchedule', event.scheduleId).then((sched) => {
        //                alert(sched.get("isPosted"));
        if (sched.get("isPosted")) {
          revertFunc();
          // alert("Posted!");
          return;
        }
        var original_start = sched.get('scheduledTime');
        var updatedStart = moment(original_start).add(delta, 'ms');

        var updatedStart_utc_format = moment(updatedStart).utc().format();

        if (!confirm("Save changes?")) {
          revertFunc();
        } else {
          sched.set("dateTime", updatedStart_utc_format);
          sched.set("tempTime", null);
          sched.save();
        }
      });

    },
    eventAllow: function(dropLocation, draggedEvent) {
      const currentBrandRole = this.get('session.currentBrandRole');

      if (currentBrandRole.get('managePosts')) {
        return true;
      }
      return false;
    },
    cancelPost: function(post) {
      this.updateEvents();
    },
    tempAdd: function(item) {
      item.set("tempID", this.uid());
      this.get("temps").pushObject(item);
      this.constructTemp(item);
    },
    tempRemove: function(item) {
      //  alert("Remove");
      Ember.$('.full-calendar').fullCalendar('removeEvents', item.get("tempID"));
      this.get("temps").removeObject(item);
    },
    tempUpdate: function(item) {
      var event = this.tempEvent(item);
      var updated = this.updateTemp(item, event);
      Ember.$('.full-calendar').fullCalendar('updateEvent', updated);
    },
    quickPost: function() {
      var record = this.get("store").createRecord("posting", {
        "brand": this.get("brand")
      });
      this.get("quickposts").pushObject(record);

    },
    quickPostDone: function() {
      this.set("quickposts", []);
    },
    bulkAdd: function() {
      this.set("bulkEditor", true);


    },
    clearFilters: function() {
      this.doClearFilters();
    },
    advancedToggle: function() {
      /*global $*/
      if ($("#filter-toggle").hasClass("open")) {
        $("#filter-toggle").removeClass("open");
        $("#filter-toggle").addClass("closed");
        $("#filter-toggle").hide();
        $("#cal-container").removeClass("col-md-9");
        $("#cal-container").removeClass("col-lg-10");
        $("#cal-container").addClass("col-sm-12");
      } else {

        $("#cal-container").removeClass("col-sm-12");
        $("#cal-container").addClass("col-md-9");
        $("#cal-container").addClass("col-lg-10");

        $("#filter-toggle").removeClass("closed");
        $("#filter-toggle").addClass("open");
        $("#filter-toggle").show();
      }
    },
    viewDrafts: function() {
      var component = this;
      //            this.send("updateAccounts", null);
      this.set("selectedAccounts", []);
      this.set("selectedNetworkTypes", []);
      this.set("selectedCampaigns", []);
      this.set("selectedCategories", []);
      this.set("selectedTags", []);
      this.set("selectedDraft", 1);
      this.set("selectedStatus", []);
      this.set("selectedUsers", []);

      this.get("store").fetchRecord("user", this.get("session.data.authenticated.userId")).then((me) => {
        component.get("selectedUsers").pushObject(me);
      });
      this.set("selectedAuto", "all");
      this.clearSelected();
      this.set('draftSelected', true);
    },
    viewSending: function() {
      var component = this;
      this.set("selectedAccounts", []);
      this.set("selectedNetworkTypes", []);
      this.set("selectedCampaigns", []);
      this.set("selectedCategories", []);
      this.set("selectedTags", []);
      this.set("selectedDraft", "all");
      this.set("selectedStatus", []);
      this.get("store").fetchRecord("postingStatus", 1).then((ps) => {
        component.get("selectedStatus").pushObject(ps);
      });
      this.set("selectedUsers", []);
      this.set("selectedAuto", "all");
      this.clearSelected();
      this.set('sendingSelected', true);
    },
    viewReview: function() {
      var component = this;
      this.set("selectedAccounts", []);
      this.set("selectedNetworkTypes", []);
      this.set("selectedCampaigns", []);
      this.set("selectedCategories", []);
      this.set("selectedTags", []);
      this.set("selectedDraft", "all");
      this.set("selectedStatus", []);
      this.get("store").fetchRecord("postingStatus", 2).then((ps) => {
        component.get("selectedStatus").pushObject(ps);
      });
      this.get("store").fetchRecord("postingStatus", 4).then((ps) => {
        component.get("selectedStatus").pushObject(ps);
      });
      this.get("store").fetchRecord("postingStatus", 6).then((ps) => {
        component.get("selectedStatus").pushObject(ps);
      });
      this.set("selectedUsers", []);
      this.set("selectedAuto", "all");
      this.clearSelected();
      this.set('reviewSelected', true);
    },
    viewSent: function() {
      var component = this;
      this.set("selectedAccounts", []);
      this.set("selectedNetworkTypes", []);
      this.set("selectedCampaigns", []);
      this.set("selectedCategories", []);
      this.set("selectedTags", []);
      this.set("selectedDraft", "all");
      this.set("selectedStatus", []);
      this.get("store").fetchRecord("postingStatus", 5).then((ps) => {
        component.get("selectedStatus").pushObject(ps);
      });
      this.set("selectedUsers", []);
      this.set("selectedAuto", "all");
      this.clearSelected();
      this.set('sentSelected', true);
    },
    viewFailed: function() {
      this.set("selectedAccounts", []);
      this.set("selectedNetworkTypes", []);
      this.set("selectedCampaigns", []);
      this.set("selectedCategories", []);
      this.set("selectedTags", []);
      this.set("selectedDraft", "all");
      this.set("selectedStatus", []);
      this.set("selectedUsers", []);
      this.set("selectedAuto", "all");
      this.clearSelected();
      this.set('failedSelected', true);
    },
    eventClicked: function(e) {
      //            alert(e.postingId);
      //            this.get('router').transitionTo('brand.edit.post.edit', this.get("brand"), e.postingId);
      //  alert(e.postingId);
      const currentBrandRole = this.get('session.currentBrandRole');

      if (!currentBrandRole.get('managePosts')) {
        return false;
      }

      var self = this;
      if (e.postingId != "temp" && e.postingId != "freeslot") {
        this.get("store").fetchRecord("posting", e.postingId).then((post) => {
          self.get("quickedit").pushObject(post);
        });
      }
      if (e.postingId == "freeslot") {


        var record = this.get("store").createRecord("posting", {
          "networkType": e.networkType,
          "brand": this.get("brand"),
          "campaign": this.get("campaign"),
          'preset': true
        });

        if (e.socialAccount.get("platform") == "wordpress") {
          record.set("isBlog", true);
        }

        var psr = this.get("store").createRecord("postingSchedule", {
          'socialAccount': e.socialAccount,
          'dateTime': e.dateTime,
          'posting': record,
          'preset': true,
          'tempID': this.uid()
        });
        record.get("postingSchedules").pushObject(psr);
        // record.get("socialAccounts").pushObject(e.socialAccount);
        self.get("quickposts").pushObject(record);

      }
    },
    closeEdit: function() {
      this.set("quickedit", []);
    },
    eventRender: function(event, element) {
      element.find('.fc-title').html(event.title);
      element.find('.fc-list-item-title').html(event.title);
      element.find(".fc-title").tooltip({
        'title': event.title,
        'html': true,
        'placement': 'auto top'
      }).on('show.bs.tooltip', function() {
        // if this is a touch-enabled device we add extra
        // empty mouseover listeners to the body's immediate children;
        // only needed because of broken event delegation on iOS
        // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html
        if ('ontouchstart' in document.documentElement) {
          $('body').children().on('mouseover', null, $.noop)
        }
      }).on('hidden.bs.tooltip', function() {
        // if this is a touch-enabled device we remove the extra
        // empty mouseover listeners we added for iOS support
        if ('ontouchstart' in document.documentElement) {
          $('body').children().off('mouseover', null, $.noop)
        }
      });

    },
    updateTZ: function(tz) {
      if (this.get("selectedTZ") != tz) {
        this.set("selectedTZ", tz);
      }
    },
    updateAccounts: function(accounts) {
      this.set("selectedAccounts", accounts);
    },
    updateNetworkTypes: function(networkTypes) {
      this.set("selectedNetworkTypes", networkTypes);
    },
    updateCampaigns: function(campaigns) {
      this.set("selectedCampaigns", campaigns);
    },
    updateCategories: function(categories) {
      this.set("selectedCategories", categories);
    },
    updateTags: function(tags) {
      this.set("selectedTags", tags);
    },
    updateDrafts: function(drafts) {
      this.set("selectedDraft", drafts);
    },
    updateAuto: function(auto) {
      this.set("selectedAuto", auto);
    },
    updateStatuses: function(statuses) {
      this.set("selectedStatus", statuses);
    },
    updateUsers: function(users) {
      this.set("selectedUsers", users);
    },
    postDone: function() {
      this.updateEvents();
    },
    onViewChange: function(view) {
      alert(JSON.stringify(view));
    },
    viewRender: function(view, element) {
      //            alert(view.start + " / " + view.end);
      this.set("visStart", view.start);
      this.set("visEnd", view.end);
    }
  }
});
