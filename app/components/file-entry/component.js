import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service('store'),
  session: Ember.inject.service('session'),
  isUploading: false,
  multiple: true,
  file: null,
  isMulti: false,
  uid: null,
  getGUID: function() {
    return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
      this.s4() + '-' + this.s4() + this.s4() + this.s4() + Math.random().toString().replace(".", "");
  },
  init: function() {
    if (this.get('multi') === true) {
      this.set("isMulti", true);
    }
    this.set("brandFile", false);
    this.set("uid", this.getGUID());
    this._super();
    setInterval("$('input[capture=camera]').removeAttr('capture')", 1000);
  },

  s4: function() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  },
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
  brandFile: false,
  actions: {
    selectFile() {
      if (this.get("brandFile")) {
        this.set("brandFile", false);
      }
      else {
        this.set("brandFile", true);
      }
    },
    doSelect(file) {
      this.get("uploadedAction")(file);
      this.set("brandFile", false);
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
