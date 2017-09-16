import Ember from 'ember';

export default Ember.Component.extend({
  showModal: false,
  loaded: false,
  store: Ember.inject.service("store"),
  session: Ember.inject.service('session'),
  reason: "",
  cantPost: Ember.computed('session.brand', function() {
    var self = this;
    var brand = this.get("session.brand");
    if (brand.get("socialAccounts.length") == 0) {
      this.set("reasonTitle", "Social Account Needed");
      this.set("reason", "You must have at least 1 social account configured. Please add a social account to your brand.");
      return true;
    } else {
      if (this.get("post.isBlog")) {
        this.set("reasonTitle", "Wordpress Account Needed");
        this.set("reason", "You must have at least 1 Wordpress account configured. Please add one to your brand.");
        this.set("canPostFlag", true);
        Ember.RSVP.all(this.get("brand.socialAccounts").map(function(sa) {

          if (sa.get("platform") == "wordpress") {

            self.set("canPostFlag", false);
          }
        }));
        return this.get("canPostFlag");
      } else {
        this.set("reasonTitle", "Social Account Needed");
        this.set("canPostFlag", true);
        this.set("reason", "You must have at least 1 social account configured. Please add a social account to your brand.");
        Ember.RSVP.all(this.get("brand.socialAccounts").map(function(sa) {

          if (sa.get("platform") != "wordpress") {

            self.set("canPostFlag", false);
          }
        }));
        return this.get("canPostFlag");

      }
    }
  }),
  init() {
    var self = this;
    this.set("loaded", false);
    this._super();
    this.set("loaded", false);
    if (this.get("postid")) {
      Ember.run.once(this, "tests");
    } else {
      if (self.get("loadNow")) {

        self.set("showModal", true);
        $("body").addClass('modalOpen');

      }
      self.set("loaded", true);
    }
    this.set("temps", []);
  },
  temps: [],
  tests: function() {
    var self = this;
    this.get("store").findRecord("posting", this.get("postid")).then((post) => {
      self.set("post", post);
      Ember.run.once(self, "tests2");
    });
  },
  tests2: function() {
    var self = this;
    Ember.RSVP.all(self.get("post.postingSchedules").map(function(ps) {

      console.log(ps.get("socialAccount.title") + ".." + ps.get("dateTime"));

    })).then(function() {
      if (self.get("loadNow")) {

        self.set("showModal", true);
        $("body").addClass('modalOpen');
      }
      self.set("loaded", true);

      if (typeof(Event) === 'function') {
        // modern browsers
        window.dispatchEvent(new Event('resize'));
      } else {
        // for IE and other old browsers
        // causes deprecation warning on modern browsers
        var evt = window.document.createEvent('UIEvents');
        evt.initUIEvent('resize', true, false, window, 0);
        window.dispatchEvent(evt);
      }
      $(window).trigger('resize');
    });
  },
  actions: {
    addAccount: function() {

      var self = this;
      if (this.get("showModal")) {
        this.set("showModal", false);
        $("body").removeClass('modalOpen');
        if (self.get("closer")) {
          if (!self.get("post.isNew")) {
            self.get("store").findRecord("posting", this.get('postid'));
          }
          self.get("closer")();


        }
      } else {
        this.set("showModal", true);
        $("body").addClass('modalOpen');
      }
      this.get("router").transitionTo("brand.edit.socialaccounts.addsocial", this.get("session.company"), this.get("session.brand"));
    },
    // cancelPost: function(post) {
    //     var self = this;
    //     if (confirm("Cancel post?")) {
    //         if (post.get("postingSchedules.length") > 0) {
    //             post.get("postingSchedules").map((ps) => {
    //                 if (ps.get("tempID")) {
    //                     // self.get("tempRemove")(ps);
    //                 }
    //             });
    //         }
    //         if (this.get("temps.length") > 0) {
    //             this.set("temps", []);
    //         }
    //
    //         post.deleteRecord();
    //         post.save().then(function() {
    //             // this.get('removeTemp')(post);
    //             self.set("showModal", false);
    //             $("body").removeClass('modalOpen');
    //             if (self.get("closer")) {
    //
    //                 self.get("closer")(post);
    //
    //             }
    //             if (self.get("cancelPost")) {
    //                 self.get("cancelPost")();
    //             }
    //         });
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
    postDone: function(post) {
      var self = this;
      this.set("showModal", false);
      $("body").removeClass('modalOpen');
      if (this.get("temps.length") > 0) {
        this.set("temps", []);
      }
      if (post.get("postingSchedules.length") > 0) {
        post.get("postingSchedules").map((ps) => {
          if (ps.get("tempID")) {
            if (self.get("tempRemove")) {
              self.get("tempRemove")(ps);
            }
          }
        });
      }
      if (self.get("closer")) {
        if (!self.get("post.isNew") && typeof(self.get("postid")) == "string" && self.get("postid") != null && self.get("postid") != "") {
          self.get("store").findRecord("posting", this.get('postid'));
        }
        self.get("closer")(post);

      }
    },
    toggleModal: function() {
      if (confirm("Close Post?")) {
        if (this.get("showModal")) {
          this.set("showModal", false);
          $("body").removeClass('modalOpen');
          if (this.get("closer")) {
            if (!this.get("post.isNew")) {
              if (this.get('postid')) {
                this.get("store").findRecord("posting", this.get('postid'));
              }
            }
            this.get("closer")(this.get("post"));
          }
        } else {
          this.set("showModal", true);
          $("body").addClass('modalOpen');
        }

      }
    }
  }
});
