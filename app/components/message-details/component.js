import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service('store'),
  session: Ember.inject.service(),
  tagName: 'li',
  isEditing: false,
  editModeObs: Ember.observer("isEditing", function(){
    if(this.get("isEditing")){
      this.editSetup();
    }
  }),
  initTooltip: function() {
    var tooltipHash = {
      "message-pinned": "Pin message",
      "message-unpinned": "Unpin message",
      "message-checked": "Check message",
      "message-unchecked": "Uncheck message",
      "message-edit": "Edit message"
    }
    for(var k in tooltipHash){
      const title = `<span>${tooltipHash[k]}</span>`;
      this.$('.'+k).tooltip({
        'title': title,
        'html': true,
        'placement': 'auto top'
      }).on('show.bs.tooltip', function() {
        if ('ontouchstart' in document.documentElement) {
          $('body').children().on('mouseover', null, $.noop)
        }
      }).on('hidden.bs.tooltip', function() {
        if ('ontouchstart' in document.documentElement) {
          $('body').children().off('mouseover', null, $.noop)
        }
      });
    }
  },
  didUpdateAttrs() {
    this._super(...arguments);
    this.initTooltip();
  },
  keyPress: function(event){
    if(this.get("isEditing") && event.keyCode==13){
        event.preventDefault();
        this.send("save");
      }
  },
  keyUp: function(event){
    if(this.get("isEditing") && event.keyCode==27){
        event.preventDefault();
        this.send("cancel");
    }
  },
  fetchMentions: function() {
      let re = re = /data-userid="(\w+)"\s/g;
      const str = this.get("message.message");
      const wordList = str.match(re);
      const that = this;
      const mentionsArray = [];
      if (Ember.isPresent(wordList)) {
          wordList.forEach(function(word) {
              let userId = word.replace(re, '$1');
              mentionsArray.push(that.get('store').peekRecord('user', userId));
          });
      }
      return Ember.A(mentionsArray);
  },
  editSetup: function(){
    Ember.run.later(this, function(){
      $("#"+this.get("message.id")).html(this.get("message.message"));
      const that = this;
      Ember.$("#" + this.get("message.id")).get(0).focus();
      Ember.$("#" + this.get("message.id")).atwho({
        at: "@",
        data: this.get("users"),
        displayTpl: '<li>${name} <small>${email}</small></li>',
        insertTpl: "<span data-userId=${id} class='mention'>@${name}</span>",
        spaceSelectsMatch: true,
        callbacks: {
          filter: function(query, data) {
            var _results, i, item, len, j, searchKeys;
            searchKeys = ["name", "email"]
            _results = [];
            for (i = 0, len = data.length; i < len; i++) {
              item = data[i];
              for (j = 0; j < searchKeys.length; j++) {
                var searchKey = searchKeys[j];
                if (~new String(item[searchKey]).toLowerCase().indexOf(query.toLowerCase()) && _results.indexOf(item) == -1) {
                  _results.push(item);
                }
              }
            }
            return _results;
          },
          sorter: function(query, items) {
            var _results, i, item, len;
            if (!query) {
              return items;
            }
            _results = [];
            for (i = 0, len = items.length; i < len; i++) {
              item = items[i];
              item.atwho_order = new String(item["name"]).toLowerCase().indexOf(query.toLowerCase());
              if (item.atwho_order == -1) {
                item.atwho_order = new String(item["email"]).toLowerCase().indexOf(query.toLowerCase());
              }
              if (item.atwho_order > -1 && _results.indexOf(item) == -1) {
                _results.push(item);
              }
            }
            return _results.sort(function(a, b) {
              return a.atwho_order - b.atwho_order;
            });
          }
        }
      });
    }, 0);
  },
  users: [],
  init: function() {
    let component = this;
    component.set("users", []);
    const brandId = this.get('session.brand.id');
    this.get('store').peekAll('brand-member').filter(function(member) {
      return member.get('brand.id') === brandId;
    }).map(function(filteredMember) {
      component.get('users').push({
        name: filteredMember.get('user.fullName'),
        email: filteredMember.get('user.email'),
        id: filteredMember.get('user.id')
      });
    });
    return this._super();
  },
  didInsertElement: function(){
    this.initTooltip();
    if(this.get("highlight")){
      this.$().addClass("msg-highlight");
      Ember.run.later(this, function(){
        this.$().removeClass("msg-highlight");
      }, 2000);
    }
  },
  actions: {
    edit: function(){
      this.set("isEditing", true);
    },
    pin: function(){
      this.toggleProperty('message.pinned');
      this.sendAction("updateMessage", this.get("message"));
    },
    check: function(){
      this.toggleProperty('message.checked');
      this.sendAction("updateMessage", this.get("message"));
    },
    save: function(){
      const _this = this;
      const mentions = this.fetchMentions();
      mentions.forEach(function(mention) {
          _this.get('message.mentions').addObject(mention);
      });
      this.set("message.message", Ember.$("#" + this.get("message.id")).html());
      this.sendAction("updateMessage", this.get("message"));
      Ember.run.later(this, function(){
        this.set("isEditing", false);
      }, 0);
      // this.get('message').save().then(function(message){
      //   _this.set("isEditing", false);
      // });
    },
    cancel: function(){
      this.get("message").rollbackAttributes();
      this.set("isEditing", false);
    }
  }
});
