import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service("store"),
  posts: [],
  init: function() {
    this.set("posts", []);
    return this._super();
  },
  didReceiveAttrs() {
    var self = this;
    if (this.get("premade.length")) {
      this.get("premade").map(function(p) {
        if (!self.get("posts").includes(p)) {
          self.get("posts").pushObject(p);
        }
      });
    }
  },
  uid: function() {
    var d = new Date().getTime();

    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  },
  actions: {
    tempAdd(ps) {
      this.get('tempAdd')(ps);
    },
    tempRemove(ps) {
      this.get("tempRemove")(ps);
    },
    tempUpdate(ps) {
      this.get("tempUpdate")(ps);
    },
    updatePost(post) {
      this.get('updateTemp')(post);
    },
    addPost() {
      var record = this.get("store").createRecord("posting", {
        'brand': this.get("brand")
      });

      // this.get('addTemp')(record);
      this.get("posts").pushObject(record);
    },
    // cancelPost(post) {
    //     var self = this;
    //     if (this.get("tempRemove")) {
    //         if (post.get("postingSchedules.length") > 0) {
    //             post.get("postingSchedules").map((ps) => {
    //                 if (ps.get("tempID")) {
    //                     self.get("tempRemove")(ps);
    //                 }
    //             });
    //         }
    //     }
    //     post.deleteRecord();
    //     var self = this;
    //     if (!post.isNew) {
    //         post.save().then(function() {
    //             self.get("posts").removeObject(post);
    //             if (self.get("cancelPost")) {
    //                 self.get("cancelPost")(post);
    //             }
    //         });
    //     }
    //     else {
    //         // this.get('removeTemp')(post);
    //         this.get("posts").removeObject(post);
    //         if (this.get("cancelPost")) {
    //             this.get("cancelPost")(post);
    //         }
    //     }
    // },
    cancelPost(post) {
      var self = this;
      if (confirm("Cancel Post?")) {
        var uncomittedPostingSchedules = post.get('postingSchedules').filter((ps) => {
          return !ps.get('isPosted');
        });
        var comittedPostingSchedules = post.get('postingSchedules').filter((ps) => {
          return ps.get('isPosted');
        });
        if (comittedPostingSchedules.length > 0 && uncomittedPostingSchedules.length > 0) {
          var promises = uncomittedPostingSchedules.map((ps) => {
            return ps.destroyRecord();
          });
          promises.push(post.reload());
          Ember.RSVP.all(promises).then((prmses) => {
            self.set("showModal", false);
            $("body").removeClass('modalOpen');
            if (self.get("closer")) {
              self.get("closer")(post);
            }
            if (self.get("cancelPost")) {
              self.get("cancelPost")();
            }
          });
        } else {
          post.destroyRecord().then(() => {
            self.set("showModal", false);
            $("body").removeClass('modalOpen');
            if (self.get("closer")) {
              self.get("closer")(post);
            }
            if (self.get("cancelPost")) {
              self.get("cancelPost")();
            }
          });
        }
      }
    },
    postDone(post) {
      // this.get('removeTemp')(post);
      if (post.get("postingSchedules.length") > 0) {
        post.get("postingSchedules").map((ps) => {
          if (ps.get("tempID")) {
            self.get("tempRemove")(ps);
          }
        });
      }
      this.get("posts").removeObject(post);
      this.get("postDone")();
    }
  }
});
