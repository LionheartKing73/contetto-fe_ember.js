import Ember from 'ember';

export default Ember.Component.extend({
  quickpost: Ember.inject.service('quickpost'),
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
  slotDuration: '00:15:00',
  defaultTimedEventDuration: '00:15:00',
  /*Component vars*/
  selectedAssigned: [],
  selectedCreated: [],
  selectedStatus: [],
  selectedTZ: null,
  showFilters: false,
  params: function() {
    var params = {
      data: {
        brand: this.get('brand.id')
      }
    };
    if (this.get("selectedAssigned.length") > 0) {
      params.data.assignedToUser = this.get("selectedAssigned").toArray().map(function(item) {
        return item.id;
      }).join(',');
    }
    if (this.get("selectedCreated.length") > 0) {
      params.data.requestBy = this.get("selectedCreated").toArray().map(function(item) {
        return item.id;
      }).join(',');
    }
    if (this.get("selectedStatus.length") > 0) {
      params.data.status = this.get("selectedStatus").toArray().map(function(item) {
        return item.id;
      }).join(',');
    }
    return params;
  },
  ajax: Ember.inject.service('ajax'),
  store: Ember.inject.service('store'),
  events: [],
  fetchEvents: Ember.computed('selectedAssigned', 'selectedCreated', 'selectedStatus', 'selectedTZ', {
    get() {
      if (this.get("selectedTZ") != null) {
        Ember.$('.full-calendar').fullCalendar('removeEvents');
        var component = this;
        return this.get("ajax").request("https://gke.contetto.io/postings/v1/changeRequests", this.params()).then(events => {
          //   console.log(JSON.stringify(events));
          if (events.data.length > 0) {
            // console.log("Haz events!");
            events.data.map(function(eventJSON) {
              //    console.log(eventJSON);
              if (eventJSON.attributes.requestDue != null && eventJSON.attributes.requestDue != "") {
                /*global moment*/
                if (moment(eventJSON.attributes.requestDue).isValid()) {

                  var start = moment(eventJSON.attributes.requestDue).tz(component.get('selectedTZ')).format();
                  var title = "";
                  if (eventJSON.attributes.subject != "") {
                    title += eventJSON.attributes.subject + "<BR/>";
                  }
                  component.get('store').fetchRecord('changeRequest', eventJSON.id).then((crO) => {
                    crO.get('assignedToUser').then((atu) => {
                      crO.get('requestBy').then((rbu) => {
                        if (crO.get('posting.id')) {
                          title += "<strong>Assigned to:</strong> " + crO.get('assignedToUser.fullName') + "<BR/>";
                          title += "<strong>Assigned By:</strong> " + crO.get("requestBy.fullName") + "<BR/>";
                          //  title += "<strong>Due On:<strong> " + start + "<BR/>";
                          title += "<strong>Status:</strong> " + crO.get("status.name");
                          var me = "";
                          if (component.get("session.data.authenticated.userId") == crO.get("assignedToUser.id")) {
                            me = "assignedToMe";
                          }
                          var created = "";
                          if (component.get("session.data.authenticated.userId") == crO.get("requestBy.id")) {
                            me = "createdByMe";
                          }

                          var event = {
                            'id': crO.get('id'),
                            'start': start,
                            'title': title,
                            'postingId': crO.get("posting.id"),
                            'classes': [crO.get("status.name"), me, created]
                          };
                          Ember.$('.full-calendar').fullCalendar('renderEvent', event, true);
                          //          console.log(JSON.stringify(event));
                        }
                      })
                    })

                  });
                }
              }
            });
          }
        });
      }
    }
  }),
  actions: {
    updateTZ: function(tz) {
      if (this.get("selectedTZ") != tz) {
        this.set("selectedTZ", tz);
      }
    },
    updateCreated: function(accounts) {
      this.set("selectedCreated", accounts);
    },

    updateAssigned: function(accounts) {
      this.set("selectedAssigned", accounts);
    },

    updateStatus: function(accounts) {
      this.set("selectedStatus", accounts);
    },
    eventClicked: function(e) {
      //            alert(e.postingId);
      //this.get('router').transitionTo('brand.edit.post.edit', this.get("brand"), e.postingId);
      var self = this;
      this.get("store").fetchRecord("posting", e.postingId).then((p) => {
        self.get("quickpost").editPost(p);

      });
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
    toggleFilters() {
      this.toggleProperty('showFilters')
    },
    clearFilters() {
      this.set('selectedAssigned', []);
      this.set('selectedCreated', []);
      this.set('selectedStatus', []);
      this.set('selectedTZ', null);
    }
  }
});
