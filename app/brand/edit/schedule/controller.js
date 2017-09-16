import Ember from 'ember';
import DS from 'ember-data';

const {
  Controller,
  get,
  computed,
  inject: {
    service
  }
} = Ember;

export default Controller.extend({
  store: service(),

  queryParams: {
    userId: 'user',
    editPost: 'post',
  },
  userId: null,
  loaded: false,
  init() {
    this._super();
    this.set("loaded", false);
    Ember.run.once(this, "getUser");
  },
  user: null,
  post: null,
  getUser: function() {
    var self = this;
    if (this.get("userId") != "" && this.get("userId") != null) {
      this.get("store").fetchRecord("user", this.get("userId")).then((userObj) => {
        self.set("user", userObj);
        self.set("loaded", true);
      });
    }
    else if (this.get("editPost") != "" && this.get("editPost") != null) {
      this.get("store").fetchRecord("posting", this.get("editPost")).then((post) => {
        self.set("post", post);
        self.set("loaded", true);
      });
    }
    else {
      self.set("loaded", true);
    }

  }
});
