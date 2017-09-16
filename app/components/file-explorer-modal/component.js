import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service('store'),
  session: Ember.inject.service('session'),
  folderPath: Ember.computed('folder.id', 'folder.name', {
    get() {
      var path = "";
      if (this.get("folder.parent.id")) {
        path += this.get("folder.parent.name");
      } else {
        path += "root";
      }
      if (this.get("folder.name")) {
        path += " / " + this.get("folder.name");
      }
      return path;
    }
  }),
  folder: null,
  files: [],
  folders: [],
  init() {
    this._super();
    this.initialize();
  },
  doRefresh: Ember.observer("model", function() {
    this.initialize();
  }),
  initialize() {
    this.set("files", []);
    this.set("folders", []);
    this.set("folder", null);
    this.reload();
    var self = this;
    this.set("brand", self.get('session.brand.id'));
  },
  reload() {
    var self = this;
    this.get("store").query("folder", {
      'brand': self.get('session.brand.id'),
      'parent': this.get("folder.id")
    }).then((folders) => {
      self.set("folders", folders);
    });
    this.get("store").query("file", {
      'brand': self.get('session.brand.id'),
      'folder': this.get("folder.id")
    }).then((files) => {
      self.set('files', files);
    });
  },
  actions: {
    select(file) {
      this.get("select")(file);
    },
    selectFolder(folder) {
      this.set("folder", folder);
      this.reload();
    }
  }
});
