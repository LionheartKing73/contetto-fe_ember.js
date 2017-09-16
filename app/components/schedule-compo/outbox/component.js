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
        if (this.get("selectedTZ") != null) {
          Ember.run.debounce(this, "updateEvents", 200);

        }
      }
    }),
  init: function() {
    this._super();
    //        alert("hi");
    Ember.run.once(this, "doClearFilters", true);
  },
  didInsertElement() {
    if ($(window).width() > 768) {
      $("#outbox-container .dropdown-menu").css("display", "block");
    }
    $("#outbox-container #dashboard-screen .dropdown-menu").css("display", "none");
    $("#myBrand #outbox-container .dropdown-menu").click(function() {
      $("#outbox-container .dropdown-menu").css({
        "display": "block"
      });
    });
    var flag = 0;
    $("#myBrand #outbox-container .dropdown-toggle").click(function() {
      if (flag == 0) {
        flag++;
        $("#outbox-container .dropdown-menu").css({
          "display": "block"
        });
      } else {
        flag = 0;
        $("#outbox-container .dropdown-menu").css({
          "display": "none"
        });
      }
    });
    $('#outbox-container .nav-tabs-dropdown').each(function(i, elm) {
      $(elm).text($(elm).next('ul').find('li.active a').text());
    });
    $('#outbox-container .nav-tabs-dropdown').on('click', function(e) {
      e.preventDefault();
      $(e.target).toggleClass('open').next('ul').slideToggle();
    });
    $('#outbox-container #nav-tabs-wrapper a[data-toggle="tab"]').on('click', function(e) {
      e.preventDefault();
      $(e.target).closest('ul').hide().prev('a').removeClass('open').text($(this).text());
    });
  },
  didUpdateAttrs: function() {

  },
  tElement: function() {},

  updateEvents: function() {


    var component = this;
    console.log(this.get("queryParams.data"));
    return this.get("store").query("posting-schedule", this.get("queryParams.data")).then((schedules) => {
      component.set("_events", []);
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
                    component.get("_events").pushObject(schedule);
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
  _events: [],
  messageSort: ['scheduledTime:desc'],
  events: Ember.computed.sort('_events', 'messageSort'),



  queryParams: Ember.computed("brand.id", "fromDate", "endDate", "selectedAccounts.length", "selectedNetworkTypes.length", "selectedCampaigns.length", "selectedCategories.length", "selectedTags.length", "selectedDraft", "selectedAuto", "selectedStatus.length", "selectedUsers.length", function() {
    var params = {
      data: {
        brand: this.get("brand.id"),
        fromDate: moment(this.get("fromDate")).utc().format(),
        endDate: moment(this.get("endDate")).utc().format()
      }
    }
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
  }),
  sa() {
    var sa = "";
    if (this.get("selectedAccounts.length") > 0) {
      sa = this.get("selectedAccounts").toArray();
    } else {
      sa = this.get("brand.socialAccounts").toArray();
    }
    return sa;
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

  },
  clearActiveClassFilter: function() {
    ["mydraft", "sending", "review", "sent"].forEach(function(id) {
      if ($("#" + id).hasClass("active")) {
        $("#" + id).removeClass("active");
      }
    });
  },
  applyActiveClassFilter: function(id) {
    $("#" + id).addClass("active");
  },
  actions: {

    clearFilters: function() {
      this.clearActiveClassFilter();
      this.doClearFilters();
    },
    advancedToggle: function() {
      /*global $*/
      // if ($("#filter-toggle").hasClass("open")) {
      //     $("#filter-toggle").removeClass("open");
      //     $("#filter-toggle").addClass("closed");
      //     $("#filter-toggle").hide();
      //     $("#cal-container").removeClass("col-md-9");
      //     $("#cal-container").removeClass("col-lg-10");
      //     $("#cal-container").addClass("col-sm-12");
      // }
      // else {
      //
      //     $("#cal-container").removeClass("col-sm-12");
      //     $("#cal-container").addClass("col-md-9");
      //     $("#cal-container").addClass("col-lg-10");
      //
      //     $("#filter-toggle").removeClass("closed");
      //     $("#filter-toggle").addClass("open");
      //     $("#filter-toggle").show();
      // }
      $("#advanced-filters").toggle();
      if ($("#content-cols").hasClass("col-md-9")) {
        $("#content-cols").removeClass("col-md-9");
        $("#content-cols").addClass("col-md-12");
        $("#advanced-filters-cols").removeClass("col-md-3");
      } else if ($("#content-cols").hasClass("col-md-12")) {
        $("#content-cols").removeClass("col-md-12");
        $("#content-cols").addClass("col-md-9");
        $("#advanced-filters-cols").addClass("col-md-3");
      }
    },
    viewDrafts: function() {
      this.clearActiveClassFilter();
      this.applyActiveClassFilter("mydraft");
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
    },
    viewSending: function() {
      this.clearActiveClassFilter();
      this.applyActiveClassFilter("sending");
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
    },
    viewReview: function() {
      this.clearActiveClassFilter();
      this.applyActiveClassFilter("review");
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
    },
    viewSent: function() {
      this.clearActiveClassFilter();
      this.applyActiveClassFilter("sent");
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
    },
    viewFailed: function() {
      this.clearActiveClassFilter();
      this.applyActiveClassFilter("failed");
      this.set("selectedAccounts", []);
      this.set("selectedNetworkTypes", []);
      this.set("selectedCampaigns", []);
      this.set("selectedCategories", []);
      this.set("selectedTags", []);
      this.set("selectedDraft", "all");
      this.set("selectedStatus", []);
      this.set("selectedUsers", []);
      this.set("selectedAuto", "all");
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
    },
    refresh: function() {
      this.updateEvents();
    }
  }
});
