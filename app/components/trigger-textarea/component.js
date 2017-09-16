import Ember from 'ember';
const {
  get
} = Ember;
export default Ember.Component.extend({
  store: Ember.inject.service('store'),
  session: Ember.inject.service(),
  editorClassNames: Ember.computed("divClassName", function() {
    return this.get("divClassName") + " form-control input-sm chat-input";
  }),
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
  didInsertElement() {
    Ember.$("#" + get(this, "editorId")).get(0).focus();
    Ember.$("#" + get(this, "editorId")).atwho({
      at: "@",
      data: get(this, 'users'),
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
    const that = this;
    Ember.$("#" + get(this, "editorId")).keypress(function(event) {
      if (event.keyCode == 13) {
        event.preventDefault();
        that.set("taggedMessage", Ember.$("#" + that.get("editorId")).html());
        that.sendAction("sendMessage");
      }
    });
  },
  keyDown: function(e) {
    if (e.keyCode == 38) {
      this.sendAction("editLastMessage");
    }
  },
  uid: Ember.computed('s4', function() {
    return this.get('s4') + this.get('s4') + '-' + this.get('s4') + '-' + this.get('s4') + '-' +
      this.get('s4') + '-' + this.get('s4') + this.get('s4') + this.get('s4') + Math.random().toString().replace(".", "");
  }),
  s4: Ember.computed(function() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }),
  doFileUpload: function() {
    let self = this;
    const brandId = self.get('session.brand.id');
    let file = this.get('file');
    file.read().then(function(url) {
      const bucketName = "contetto-brand-" + brandId;
      const brand = self.get("store").peekRecord("brand", brandId);
      self.set('isUploading', true);
      file.upload('https://gke.contetto.io/files/v1/files', {
        multipart: true,
        data: {
          'bucket': bucketName,
          'public': 1
        }
      }).then((resp) => {
        self.set('file', null);
        self.set('isUploading', false);
        var imageId = resp.body.data.id;
        self.get('store').findRecord('file', imageId).then((fileOb) => {
          fileOb.set("brand", brand);
          fileOb.save().then((fos) => {
            self.get("uploadedAction")(fos);
          });
        });
      });
    });
  },
  actions: {
    send() {
      this.set("taggedMessage", Ember.$("#" + this.get("editorId")).html());
      this.sendAction("sendMessage");
    },
    doSelect(file) {
      $(".modal-header .close").click();
      this.get("uploadedAction")(file);
    },
    uploadFile(file, options) {
      if (file.get('size') / (1024 * 1024 * 1024) > 1) {
        options.uploader.removeFile(file.get('file'))
        return this.get(this, 'toast').error('File size too large. Try uploading a file less than 1GB.');
      }
      this.set('file', file);
      this.doFileUpload();
    },
    doUpload() {
      if (this.get("file") != null) {
        this.doFileUpload();
      }
    }
  }
});
