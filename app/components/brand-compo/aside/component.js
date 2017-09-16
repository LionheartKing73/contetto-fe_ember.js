import Ember from 'ember';
import {
  task,
  timeout
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

export default Ember.Component.extend({
  classNames: ['col-md-2', 'left-side-wrapper'],
  classNameBindings: ["isClosed:closed"],

  store: service(),
  session: service(),
  ajax: service(),
  quickpost: Ember.inject.service('quickpost'),

  upcomingPosts: [],

  assignmentBacklog: [],
  drafts: [],
  doRefresh: false,
  brandObs: Ember.observer('session.brand.id', function(){
    ['outboxSchedules', 'changeRequests', 'inboxMessages', 'draftsArray'].forEach((prop) => {
      this.notifyPropertyChange(prop);
    });
  }),
  outboxSchedules: Ember.computed(function() {
    let brand = this.get('session.brand.id');
    let fromDate = moment().utc().format();
    let endDate = moment().add(1, 'month').utc().format();
    var query = {
      brand: brand,
      fromDate: fromDate,
      endDate: endDate
    }
    return this.get("store").filter('posting-schedule', query, function(postingSchedule){
      return postingSchedule.get('validStartOutbox') && postingSchedule.get('posting.brand.id')==brand && postingSchedule.get('isInOutboxRange');
    });
  }),
  changeRequests: Ember.computed(function() {
    var self = this;
    return this.get("store").filter("changeRequest", {
      'assignedToUser': this.get('session.data.authenticated.userId'),
      'status': 1,
      'brand': this.get('session.brand.id')
    }, function(changeRequest) {
      return changeRequest.get('brand.id')==self.get('session.brand.id') && changeRequest.get("status.id")==1 && changeRequest.get("assignedToUser.id")==self.get('session.data.authenticated.userId');
    });
  }),
  inboxMessages: Ember.computed(function() {
    let fromDate = moment().subtract(6, "month").utc().set({
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0
    }).format();
    let endDate = moment().add(1, "day").utc().set({
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0
    }).format();
    let limit = 3000;
    let brand = this.get('session.brand.id');
    return this.get("store").filter("inboxItem", {
      'brand': brand,
      'limit': limit,
      'fromDate': fromDate,
      'endDate': endDate
    }, function(inboxMessage) {
      return inboxMessage.get('archive') == false && inboxMessage.get("brand.id")==brand && inboxMessage.get("createdAt").toDate()>=new Date(fromDate) && inboxMessage.get("createdAt").toDate()<=new Date(endDate);
    });
  }),
  draftsArray: Ember.computed(function() {
    let self = this;
    return this.get('store').filter('postingSchedule', {
        brand: self.get('session.brand.id'),
        isDraft: 1
      }, function(draft) {
        return draft.get('posting.brand.id')==self.get('session.brand.id') && draft.get('posting.isDraft');
    });
  }),
  assignmentsCount: Ember.computed('changeRequests.@each.id', function() {
    return this.get('changeRequests.length');
  }),
  inboxMessagesCount: Ember.computed('inboxMessages.@each.id', function() {
    return this.get('inboxMessages.length');
  }),
  outboxCount: Ember.computed('outboxSchedules.@each.id', function() {
    return this.get('outboxSchedules.length');
  }),
  draftsCount: Ember.computed('draftsArray.@each.id', function() {
    return this.get('draftsArray.length');
  }),
  init() {
    set(this, 'quickposts', []);
    return this._super();
  },
  temps: [],
  draftSort: ['posting.createdAt:asc'],
  sortedDrafts: Ember.computed.sort('drafts', 'draftSort'),
  updateSlots: Ember.observer("model.brand.id", function() {
    this.updateTabs();
  }),
  freeSlotSort: ['start:asc'],
  sortedFreeSlots: Ember.computed.sort('freeSlotEvents', 'freeSlotSort'),
  syncId: null,
  uid: function() {
    var d = new Date().getTime();

    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  },

  // Periodically refresh widget info
  _reloadDataTask: task(function*() {
    this.updateTabs();

    while (true) {
      yield timeout(60 * 1000); // Wait 60 seconds

      yield this.updateTabs();
    }
  }).on('init'),

  updateTabs() {
    /*global moment*/
    const brandId = get(this, 'session.brand.id');

    Ember.run.once(this, "getSlots");
    if (brandId) {

      const options = {
        data: {
          brand: brandId,
          fromDate: moment(new Date()).utc().format(),
          endDate: moment(new Date()).add(4, 'weeks').utc().format(),
          upcoming: true
        }
      };

      get(this, 'store').query('postingSchedule', options.data).then((schedules) => {
        set(this, 'upcomingPosts', schedules.sortBy('scheduledTime'));
      });

      const currentUserId = get(this, 'session.data.authenticated.userId');

      const options2 = {
        data: {
          brand: brandId,
          assignedToUser: currentUserId,
          status: 1
        }
      };

      get(this, 'store').query('changeRequest', options2.data).then((changeRequests) => {
        set(this, 'assignmentBacklog', changeRequests.sortBy('requestDue'));
      });


      const options3 = {
        data: {
          brand: brandId,
          isDraft: 1,
          users: currentUserId
        }
      };

      get(this, 'store').query('postingSchedule', options3.data).then((schedules) => {
        set(this, 'drafts', schedules.sortBy('scheduledTime'));
      });

    }
  },
  quickposts: [],


  slotEvents: [],
  freeSlotEvents: [],
  getSlots() {
    var self = this;
    var fromDate = moment().utc().format();
    var endDate = moment().add(2, "weeks").utc().format();
    var tsa = this.get("model.brand.socialAccounts").toArray().map(function(item) {
      return item.get("id");
    }).join(",");
    this.set("slotEvents", []);
    this.get("ajax").request("https://gke.contetto.io/postings/v1/accountFreeSlots?socialAccounts=" + tsa + "&fromDate=" + fromDate + "&endDate=" + endDate).then((resp) => {
      this.set("slotEvents", []);

      if (resp.length > 0) {
        Ember.RSVP.all(resp.map(function(tslot) {
          return self.get("store").fetchRecord("socialAccount", tslot.socialAccount).then((tsa) => {
            return self.get("store").fetchRecord("networkType", tslot.networkType).then((nt) => {

              var event = {
                'id': self.uid(),
                'start': tslot.dateTime,
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
          self.set("freeSlotEvents", Ember.ArrayProxy.create({
            content: Ember.A(self.get("slotEvents"))
          }));
        });
      } else {
        self.set("freeSlotEvents", []);
      }
    });
  },

  actions: {
    updateRefresh() {
      this.toggleProperty("doRefresh");
    },
    postLink(post) {
      this.get("quickpost").editPost(post);
    },
    quickPost: function() {
      this.get('quickpost').quickPost();
    },
    quickPostDone: function() {
      this.get('quickpost').quickPostDone();
    },
    freeSlot: function(date, type, account) {
      var record = this.get("store").createRecord("posting", {
        "networkType": type,
        "brand": this.get("model.brand"),
        'preset': true
      });
      if (account.get("platform") == "wordpress") {
        record.set("isBlog", true);
      }
      var psr = this.get("store").createRecord("postingSchedule", {
        'socialAccount': account,
        'dateTime': date,
        'posting': record,
        'preset': true,
        'tempID': this.uid()
      });
      record.get("postingSchedules").pushObject(psr);
      // record.get("socialAccounts").pushObject(e.socialAccount);
      this.get("quickpost").addPost(record);

    }



  }
});
