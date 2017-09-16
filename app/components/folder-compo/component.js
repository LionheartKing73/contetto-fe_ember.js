import Ember from 'ember';

export default Ember.Component.extend({
    store: Ember.inject.service('store'),
    session: Ember.inject.service('session'),
    folderPath: Ember.computed('folder.id', 'folder.name', {get() {
            var path = "";
            if (this.get("folder.parent.id")) {
                path += this.get("folder.parent.name");
            }
            else {
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
    doRefresh: Ember.observer("model", function(){
      this.initialize();
    }),
    initialize(){
      this.set("files", []);
      this.set("folders", []);
      this.set("folder", null);
      this.set("movingFile", null);
      this.set("isMoving", false);
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
    isMoving: false,
    movingFile: null,
    actions: {
        select(file) {
            this.get("select")(file);
        },
        selectFolder(folder) {
            this.set("folder", folder);
            this.reload();
        },
        finishUpload(file) {
            var self = this;
            file.set("folder", this.get("folder"));
            file.save().then((f) => {
                self.reload();
            });
        },
        moveFile(file) {
            if (this.get("movingFile.id")) {
                this.get("movingFile").set("isMoving", false);
            }
            file.set("isMoving", true);
            this.set("movingFile", file);
            this.set("isMoving", true);
        },
        moveFileToFolder(file, folder) {
            var self = this;
            if (this.get("movingFile.id")) {

                file.set("folder", folder);
                file.save().then((f) => {
                    f.set("isMoving", false);
                    self.set("movingFile", null);
                    self.set("isMoving", false);
                    self.reload();
                });
            }
        },
        cancelMove(file) {
            file.set("isMoving", false);
            this.set("movingFile", null);
            this.set("isMoving", false);
        },
        pasteFile() {
            var self = this;
            if (this.get("movingFile.id")) {
                var file = this.get("movingFile");
                file.set("folder", this.get("folder"));
                file.save().then((f) => {
                    f.set("isMoving", false);
                    self.set("movingFile", null);
                    self.set("isMoving", false);
                    self.reload();
                });
            }
        },
        newFolder() {
            var self = this;
            var name = prompt("New folder name:");

            var brandid = this.get('session.brand.id');
            var brand = this.get("store").peekRecord("brand", brandid);

            if (name != "" && name != null) {
                name = name.trim();
                var duplicate = false;
                var folders = this.get('folders').forEach(function(folder) {
                    if (folder.get("name") == name) {
                        duplicate = true;
                        return;
                    }
                });
                if (!duplicate) {
                    var f = this.get("store").createRecord("folder", {
                        'name': name,
                        'brand': brand
                    });

                    if (this.get("folder.id")) {
                        //alert("parent " + this.get("folder.name"));
                        f.set("parent", this.get("folder"));
                    }

                    f.save().then((fs) => {
                        self.reload();
                    });
                }
                else {
                    alert("You entered a duplicate name for new folder. Please use another name");
                }
            }
        }
    }

});
