import Ember from 'ember';
import {
  task,
  timeout
}
from 'ember-concurrency';

const {
  Component,
  get,
  set
} = Ember;

export default Component.extend({
  store: Ember.inject.service('store'),
  messages: [],
  flagOptions: [],
  selectedFlagOptions: [],
  displayMessages: Ember.computed('initmessages.@each.archive', 'isArchive', function() {
    return this.get('initmessages').filterBy('archive', this.get('isArchive'));
  }),
  filteredMessages: Ember.computed('messages.@each.archive', 'isArchive', function() {
    return this.get('messages').filterBy('archive', this.get('isArchive'));
  }),
  ajax: Ember.inject.service('ajax'),

  selectedAccounts: [],
  selectedActions: [],
  messageSort: ['createdAt:desc'],
  loaderStatus: false,
  sortedMessages: Ember.computed.sort('filteredMessages', 'messageSort'),
  showLoader: function() {
    this.set("loaderStatus", true);
  },
  hideLoader: function() {
    this.set("loaderStatus", false);
  },
  oldestMessage: function() {
    return this.get('sortedMessages.lastObject'); // or this.get('model.firstObject');
  }.property('sortedMessages.[]'),
  isInbox: Ember.computed('room', {
    get() {
      if (this.get("room") == "inbox") {
        return true;
      }
      return false;
    }
  }),
  isArchive: Ember.computed('room', {
    get() {
      if (this.get("room") == "archive") {
        return true;
      }
      return false;
    }
  }),
  isSent: Ember.computed('room', {
    get() {
      if (this.get("room") == "sent") {
        return true;
      }
      return false;
    }
  }),
  checking: false,
  init() {
    this._super();
    var self = this;
    this.set("selectedActions", []);
    this.get("inboxActions").forEach(function(a) {
      self.get("selectedActions").pushObject(a);
    });

    this.set("selectedAccounts", []);
    this.get("brand.socialAccounts").forEach(function(a) {
      self.get("selectedAccounts").pushObject(a);
    });
    this.set("replyText", "");

    this.get('ajax').request('https://gke.contetto.io/users/v1/inboxSeen', {
      method: 'POST',
      data: {
        dateTime: moment().utc().format()
      }
    });
    this.set("flagOptions", []);
    this.get("flagOptions").pushObject({
      'name': "Flagged"
    });
    this.get("flagOptions").pushObject({
      'name': "Unflagged"
    });
    this.set("selectedFlagOptions", []);
    this.get("flagOptions").forEach(function(a) {
      if (!self.get("selectedFlagOptions").includes(a)) {
        self.get("selectedFlagOptions").pushObject(a);
      }
    });
  },
  didInsertElement() {
    if ($(window).width() > 768) {
      $("#inbox-container .dropdown-menu").css("display", "block");
    }
    $("#inbox-container #dashboard-screen .dropdown-menu").css("display", "none");
    $("#myBrand #inbox-container .dropdown-menu").click(function() {
      $("#inbox-container .dropdown-menu").css({
        "display": "block"
      });
    });
    var flag = 0;
    $("#myBrand #inbox-container .dropdown-toggle").click(function() {
      if (flag == 0) {
        flag++;
        $("#inbox-container .dropdown-menu").css({
          "display": "block"
        });
      } else {
        flag = 0;
        $("#inbox-container .dropdown-menu").css({
          "display": "none"
        });
      }
    });
    $('#inbox-container .nav-tabs-dropdown').each(function(i, elm) {
      $(elm).text($(elm).next('ul').find('li.active a').text());
    });
    $('#inbox-container .nav-tabs-dropdown').on('click', function(e) {
      e.preventDefault();
      $(e.target).toggleClass('open').next('ul').slideToggle();
    });
    $('#inbox-container #nav-tabs-wrapper a[data-toggle="tab"]').on('click', function(e) {
      e.preventDefault();
      $(e.target).closest('ul').hide().prev('a').removeClass('open').text($(this).text());
    });
    this.set("messages", this.get("displayMessages").slice(0, 15));
  },
  flagFilter: null,
  updateMessages() {
    this.showLoader();
    try {
      var self = this;
      /*global moment*/
      var options = {
        brand: this.get('brand.id'),
        archive: this.get("isArchive"),
        sent: this.get("isSent"),
        fromDate: moment(this.get('fromDate')).utc().format(),
        endDate: moment(this.get('endDate')).utc().format(),
        limit: this.get("limit"),
        accounts: this.get("selectedAccounts").toArray().map(function(a) {
          return a.id;
        }).join(','),
        types: this.get("selectedActions").toArray().map(function(a) {
          return a.id;
        }).join(',')
      };
      if (this.get("flagFilter")) {
        options.flagged = this.get("flagFilter");
      }
      this.get("store").query("inboxItem", options).then(function(data) {
        self.set("initmessages", data);
        self.set("messages", self.get("displayMessages").slice(0, 15));
        self.hideLoader();
      });

      this.get('ajax').request('https://gke.contetto.io/users/v1/inboxSeen', {
        method: 'POST',
        data: {
          dateTime: moment().utc().format()
        }
      });
    } catch (e) {
      console.log(e);
      this.hideLoader();
    }
  },

  fakeFetchTask: task(function*() {
    set(this, 'isFetching', true);

    yield timeout(2000);

    set(this, 'isFetching', false);

    var length = get(this, 'messages.length');
    get(this, 'messages').pushObjects(get(this, 'displayMessages').slice(length, length + 5)).uniq();
  }),

  actions: {
    updateAccountSelect: function(newSelection, value, operation) {
      this.set('selectedAccounts', newSelection);
      this.updateMessages();
    },
    updateFlagSelection: function(newSelection, value, operation) {
      if (newSelection.length == 1) {
        if (newSelection[0].name == "Unflagged") {

          this.set("flagFilter", "-1");
        } else {
          this.set("flagFilter", "1");
        }
      } else {
        this.set("flagFilter", null);
      }
      this.set('selectedFlagOptions', newSelection);
      this.updateMessages();
    },
    updateActionSelect: function(newSelection, value, operation) {
      this.set('selectedActions', newSelection);
      this.updateMessages();
    },
    applyFilter() {
      this.updateMessages();
    },
    refresh() {
      var self = this;
      this.set("checking", true);
      this.get("ajax").request("https://gke.contetto.io/social-sync/v1/refresh?brand=" + this.get("brand.id")).then((r) => {
        self.updateMessages();
        self.set("checking", false);
      });
    },
    crossedTheLine(above) {
      var length = get(this, 'messages.length');

      if (length === get(this, 'displayMessages.length')) {
        return;
      }

      this.get('fakeFetchTask').perform();
    }
  },

});
