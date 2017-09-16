import Ember from 'ember';
import stripTags from 'contetto/utils/strip-tags';
export default Ember.Component.extend({
  store: Ember.inject.service('store'),
  session: Ember.inject.service("session"),
  toast: Ember.inject.service('toast'),
  accountSelected: null,
  campaignSelected: null,
  networkTypes: [],
  isBrandOwner: false,
  brandMembers: [],
  socialAccounts: [],
  deletes: [],

  assigning: false,
  canAssign: false,
  ps: null,
  cr: null,
  pending: null,
  lastChanged: null,
  allOK: false,
  contentLengthOK: false,
  click(event) {
    const aId = event.target.id;
    if (aId == "tab1-link") {
      $("#tab1-file-explorer").show();
    }
    if (aId == "tab2-link") {
      $("#tab1-file-explorer").hide();
    }
    if (aId == "tab3-link") {
      $("#tab1-file-explorer").hide();
    }
    if (aId == "tab4-link") {
      $("#tab1-file-explorer").hide();
    }
  },
  hasPostingSchedules: Ember.computed('post.postingSchedules.length', function() {
    return !!this.get('post.postingSchedules.length');
  }),
  hasUncomittedPostingSchedules: Ember.computed('post.postingSchedules.@each.isPosted', function() {
    return this.get('post.postingSchedules').filter((ps) => {
      return !ps.get('isPosted');
    }).length > 0;
  }),
  canCancelPost: Ember.computed('hasUncomittedPostingSchedules', function() {
    return this.get('hasUncomittedPostingSchedules');
  }),
  futureTimes() {
    /*global moment*/
    var self = this;
    if (this.get("post.postingSchedules.length") > 0) {
      self.set("allOK", true);
      this.get("post.postingSchedules").map(function(ps) {
        if (!ps.get("now")) {
          if (!Ember.isEmpty(ps.get("dateTime"))) {
            //  alert("T1 NOW " + moment().utc() + " SCHED " + moment(ps.get("dateTime")));
            if (moment().utc() > moment(ps.get("dateTime"))) {
              //        alert("F1 ");
              self.set("allOK", false);
            }
          } else if (!Ember.isEmpty(ps.get("tempTime"))) {
            //    alert("T2 " + ps.get("dateTime"));
            if (moment().utc() > moment(ps.get("tempTime"))) {
              //    alert("F2");
              self.set("allOK", false);
            }
          } else {
            if (moment().utc() > moment(ps.get("auto"))) {
              //      alert("F3");
              self.set("allOK", false);
            }
          }


        } else {
          // alert("N1");
        }
      });
      //  alert(self.get("allOK"));

      return self.get("allOK");

    } else {
      //  alert("F0");
      self.set("allOK", false);
      return false;
    }

  },
  canPost: Ember.computed('post.content', 'post.file', 'post.topic', 'socialAccounts', 'lastChanged', 'contentLengthOK', {
    get() {
      if (this.get("post.content.length") > 0) {
        var postContentPresent = (!!this.get("post.content") && !!stripTags(this.get("post.content")).replace(/&nbsp;/g, "").trim() && this.get('contentLengthOK')) || !!this.get("post.file.id");
        var titleContentPresent = !!this.get("post.topic") && !!this.get("post.topic").trim();
        if (postContentPresent && titleContentPresent && this.get("socialAccounts.length") > 0 && this.futureTimes()) {
          return true;
        }
        return false;
      } else {
        return false;
      }
    }
  }),

  disableAssignmentSubmit: Ember.computed('cr', 'cr.assignedToUser', 'cr.content', 'canPost', function() {
    if (Ember.isEmpty(this.get('cr'))) {
      return false;
    }

    if (!Ember.isEmpty(this.get('cr.assignedToUser'))) {
      return false;
    }

    return true;
  }),

  saveDeletes: function(assignment) {
    var self = this;
    if (this.get("deletes.length") > 0) {
      Ember.RSVP.all(this.get("deletes").map(function(item) {

        item.deleteRecord();
        return item.save().then(function(item) {
          self.get("deletes").removeObject(item);
        }).catch(function(e) {});
      })).then(function() {
        //    alert("Saved!");
        if(assignment){
          self.get('toast').success('Post has been assigned.');
        }
        else{
          self.get('toast').success('Post saved.');
        }

        if (!self.get("post.isBlog")) {
          self.get("postDone")(self.get("post"));
        } else {
          self.confirmBlogClose();
        }
      });
    } else {
      //            alert("Saved!");
      if(assignment){
        self.get('toast').success('Post has been assigned.');
      }
      else{
        self.get('toast').success('Post saved.');
      }
      if (!self.get("post.isBlog")) {
        self.get("postDone")(self.get("post"));
      } else {
        self.confirmBlogClose();
      }
    }
  },
  confirmBlogClose() {
    var self = this;
    var text = "The post is saved. You can configure the social followup or close this post. Clicking 'Ok' will allow you to configure social followup while 'Cancel' will close this post. Configure Followup?"
    Ember.run.next(this, function() {
      if (!confirm(text)) {
        self.get("postDone")(self.get("post"));
      }
    });
  },
  getNTs: function() {
    // alert("!!");
    var self = this;
    this.get('store').findAll('networkType').then((nt) => {
      //  alert("?!");
      nt.map(function(thisNT) {
        if (!self.get("networkTypes").includes(thisNT)) {
          self.get('networkTypes').addObject(thisNT);
        }
      });

    });

    Ember.run.once(this, 'setPS');
  },
  hasPublished: Ember.computed('post.postingSchedules', function() {
    return this.get('post.postingSchedules').filterBy('isPosted', true);
  }),
  setPS() {
    var self = this;
    /*global moment*/
    if (this.get("post.isNew")) {
      if (this.get("post.preset")) {
        self.get("post.postingSchedules").then((pss) => {
          //            alert("pss");
          pss.forEach(function(ps) {
            //         alert("ps");
            ps.get("socialAccount").then((psa) => {
              //        alert("psa");
              //alert("apsa " + psa.get("title") + "/" + psa.get("id"));
              self.get("socialAccounts").addObject(psa);
            });
          });
        });
      }

    } else {
      if (!this.get("post.isNew")) {
        //   alert("Editor");
        // this.get("store").fetchRecord("posting", this.get("post.id")).then((p) => {

        //  self.set("post", p);
        //   self.set("post.content", p.get("content"));
        self.get("post.postingSchedules").then((pss) => {
          //            alert("pss");
          pss.forEach(function(ps) {
            //         alert("ps");
            ps.get("socialAccount").then((psa) => {
              //        alert("psa");
              //        alert("apsa " + psa.get("title") + "/" + psa.get("id"));
              self.get("socialAccounts").addObject(psa);
            });
          });
        });
        //  });
      }
    }
    Ember.run.once(this, "setCampaign");
  },
  setCampaign() {
    if (!Ember.isEmpty(this.get("campaign.id"))) {
      this.set("post.campaign", this.get("campaign"));
    }
    Ember.run.once(this, "hasTeamCheck");
  },
  hasTeam: false,
  hasTeamCheck() {
    if (this.get("brand.brandMembers.length") > 1) {
      this.set("hasTeam", true);
    }
    Ember.run.once(this, "categoriesCheck");
  },
  hasCategories: false,
  categoriesCheck() {
    if (this.get("brand.categories.length") > 0) {
      this.set("hasCategories", true);
    }
    Ember.run.once(this, "campaignsCheck");
  },
  hasCampaigns: false,
  campaignsCheck() {
    if (this.get("brand.campaigns.length") > 0) {
      this.set("hasCampaigns", true);
    }
    Ember.run.once(this, "checkPendingCR");
    this.get("canPost");
  },
  allCROK: false,
  followupAccountOptions: Ember.computed('brand.socialAccounts', function() {
    var self = this;
    if (this.get("post.slot.platform")) {
      return this.get("brand.socialAccounts").filter(function(sa) {

        return sa.get("platform") == self.get("post.slot.platform");

      });
    } else {
      return this.get("brand.socialAccounts").filter(function(sa) {

        return sa.get("platform") != "wordpress";
      });

    }

  }),
  checkPendingCR() {
    var self = this;
    if (this.get("post.changeRequests.length") == 0) {
      Ember.run.once(this, "checkCanAssign");
    } else {
      this.set("allCROK", true);
      this.get("post.changeRequests").map(function(cr) {

        if (typeof(cr.get("id")) == "string") {


          self.get('store').findRecord('changeRequest', cr.get('id')).then((crr) => {

            self.get('store').fetchRecord('changeRequestStatus', crr.get('status.id')).then((crrs) => {

              if (crrs.get('name') == "Pending") {
                //            alert("PEND!");
                self.set("allCROK", false);
                self.set("canAssign", false);
                self.set("pending", crr);
              }
            });
          });
        } else {
          console.log("Cr is new ");
        }
      });
      if (this.get("allCROK")) {
        Ember.run.once(this, "checkCanAssign");
      }
    }
  },
  checkCanAssign() {
    if (this.get("brand.brandMembers.length") > 1) {
      this.set("canAssign", true);
    }
  },

  savePostingSchedules(post, assignment) {
    var self = this;
    this.get("post.postingSchedules").map(function(ps) {

      ps.set("posting", post);
      ps.save();
    });
    self.saveDeletes(assignment);
  },
  init() {
    this._super();
    var self = this;
    this.set("canAssign", false);
    Ember.run.once(this, "getNTs");

    this.set("socialAccounts", []);
    if (Ember.isEmpty(this.get("networkType.id")) && Ember.isEmpty(this.get("post.networkType.id"))) {
      this.get("store").fetchRecord("networkType", 1).then((nt) => {
        self.set("post.networkType", nt);
      });
    } else {
      if (Ember.isEmpty(this.get("post.networkType.id"))) {
        this.set("post.networkType", this.get("networkType"));
      }
    }

    if (!Ember.isEmpty(this.get("socialAccount.id"))) {
      this.doSocialSet(this.get("socialAccount"));
    }





    var iam = this.get("session.data.authenticated.userId");

    self.set("brandMembers", []);
    this.get("brand.brandMembers").then((members) => {
      console.log("brand members!");
      members.forEach(function(member) {
        member.get("brandRole").then((br) => {

          if (member.get("user.id") == iam && br.get("name") == "Owner") {

            self.set("isBrandOwner", true);
          }

        });
        member.get('user').then((user) => {
          self.get('brandMembers').addObject(user);
        });
      });
    });
    if (this.get("post.isNew")) {
      // alert("new");
      //   var cr = this.get("store").createRecord("changeRequest");
      //   this.set("cr", cr);

      //   var schedule = this.get("store").createRecord("postingSchedule");
      //  this.set("post.postingSchedule", schedule);
    }


  },
  newPost: Ember.computed('post.isNew', function() {
    return this.get("post.isNew");
  }),
  addSocialAccount: function(item, dt) {
    if (!dt) {
      dt = null;
    }
    this.get("socialAccounts").addObject(item);
    var mdt = null;
    if (this.get("post.firstTempStart")) {
      mdt = this.get("post.firstTempStart");
      this.set("post.firstTempStart", null);
    }

    let record = this.get('store').createRecord('postingSchedule', {
      'socialAccount': item,
      'dateTime': mdt,
      'now': false,
      'auto': null,
      'isPosted': false,
      'posting': this.get("post")
    });
    //   record.save();

    this.get("post.postingSchedules").addObject(record);
    if (this.get('tempAdd')) {
      this.get('tempAdd')(record);
    }
    this.set("hasSchedule", true);
  },
  deleteSocialAccount: function(item) {
    this.get("socialAccounts").removeObject(item);
    let component = this;
    let aid = item.id;

    var items = this.get('post.postingSchedules'),
      list = items.toArray();
    // alert("dsa");
    list.forEach(function(item) {
      //    alert("item");
      if (item.get('socialAccount.id') === aid) {
        //  alert("match aid " + item.get("isPosted"));
        if (item.get("isPosted")) {
          //  alert("posted already!");
        } else {
          //   alert("remove request");
          if (component.get("tempRemove")) {
            component.get("tempRemove")(item);
          }
          component.get("post.postingSchedules").removeObject(item);
          if (item.get("isNew")) {
            //                        alert("new!");
            item.deleteRecord();
          } else {
            //                      alert("Not new!");
            item.deleteRecord();
            self.get("deletes").addObject(item);
          }

        }

      }
    });
  },
  saveSnippets(post) {

    if (this.get("post.snippets.length")) {

      this.get("post.snippets").map(function(snip) {

        snip.set("parent", post);
        snip.save();

      });

    }
  },
  setChatRoom(post) {
    var self = this;
    if (post.get("chatRoom.id")) {
      this.get("store").findRecord("chatRoom", this.get("post.chatRoom.id")).then((chatRoom) => {
        chatRoom.set("name", "Discuss Post " + self.get("post.topic") + " ~" + self.get("post.id"));
        chatRoom.save();
      });
    } else {
      this.get("store").fetchRecord("user", this.get("session.data.authenticated.userId")).then((me) => {

        var chatRoom = self.get("store").createRecord("chatRoom", {
          brand: self.get("post.brand"),
          name: "Discuss Post " + self.get("post.topic") + " ~" + self.get("post.id")
        });
        chatRoom.get("users").addObject(me);
        chatRoom.save().then((chatroom) => {
          post.set("chatRoom", chatRoom);
          post.save();
        });
      });
    }
  },
  doSave: function(assignment) {
    var self = this;
    //First save the posting object
    //alert(self.get("ps.dateTime"));
    if(!this.get('post.isDraft')){
      this.set('post.isDraft', false);
    }
    this.get("post").save().then(function(post) {
      self.setChatRoom(post);
      self.saveSnippets(post);
      if (self.get("assigning")) {
        var cr = self.get("cr");

        cr.set("posting", post);
        cr.save().then(function(cr) {
          self.savePostingSchedules(post, assignment);
        });
      } else {
        self.savePostingSchedules(post, assignment);
      }

      //alert(self.get("ps.dateTime"));
      //Then save the posting schedule

      //alert("Have ps!");
      /*
      self.get("ps").set("posting", post);
      self.get("ps").save().then(function() {
          //Then save the assignment
          if (self.get("assigning")) {
              var cr = self.get("cr");

              cr.set("posting", post);
              cr.save().then(function(cr) {
                  self.saveDeletes();
              });
          }
          else {
              self.saveDeletes();
          }

      });*/
    });


  },
  updateTime(time) {
    this.set("post.postingSchedule.dateTime", time);
  },
  options: {
    theme: "snow",
    modules: {
      'syntax': true,
      'toolbar': [
        [{
          'font': []
        }, {
          'size': []
        }],
        ['bold', 'italic', 'underline', 'strike'],
        [{
          'color': []
        }, {
          'background': []
        }],
        [{
          'script': 'super'
        }, {
          'script': 'sub'
        }],
        [{
          'header': '1'
        }, {
          'header': '2'
        }, 'blockquote', 'code-block'],
        [{
          'list': 'ordered'
        }, {
          'list': 'bullet'
        }, {
          'indent': '-1'
        }, {
          'indent': '+1'
        }],
        ['direction', {
          'align': []
        }],
        ['link', 'image', 'video', 'formula'],
        ['clean']
      ]

    }
  },
  actions: {
    togglePanel() {
      var $this = $("#toggle-followups");
      if (!$this.hasClass('panel-collapsed')) {
        $this.closest('.panel').find('.panel-body').slideUp();
        $this.addClass('panel-collapsed');
        $this.find('i').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
      } else {
        $this.closest('.panel').find('.panel-body').slideDown();
        $this.removeClass('panel-collapsed');
        $this.find('i').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
      }
    },
    useSnip(snip) {
      this.set("post.content", snip.get("name"));
    },
    removeAssignment(assignment) {

    },
    addSnippet() {
      var text = $(".froala-editor-instance:first").froalaEditor("selection.text");
      var s = this.get("store").createRecord("snippet", {
        'name': text,
        'parent': this.get("post")
      });
      this.get("post.snippets").addObject(s);
    },
    removeSnippet(s) {
      this.get("post.snippets").removeObject(s);
    },
    setAndSave(html) {
      this.set("post.content", html);
      if (html.length > 0) {
        this.set("contentLengthOK", true);

      }
    },
    updateText(editor) {
      this.set('post.content', editor.root.innerHTML);
      if (editor.root.innerHTML.length > 0) {
        this.set("contentLengthOK", true);
      }
    },


    updateTime: function(time) {
      this.set('cr.requestDue', time);
    },
    contentLimitChanged: function(overlimit) {
      if (overlimit === true) {
        this.set("contentLengthOK", false);
      } else {
        this.set("contentLengthOK", true);
      }
    },
    updatecheck(ps) {
      this.set("lastChanged", moment());
      if (this.get("tempUpdate")) {
        this.get("tempUpdate")(ps);
      }
    },
    updateDT(time) {
      Ember.run.once(this, "updateTime", time);
    },
    saveDraft() {
      if (this.get("post.topic.length") > 0) {
        if (this.get("post.postingSchedules.length") > 0) {
          var self = this;
          this.set("post.isDraft", true);
          this.get("store").fetchRecord("postingStatus", 4).then((ps) => {
            self.set('post.postingStatus', ps);
            self.doSave();
          });
        } else {
          alert("Please select a social account...");
        }
      } else {
        alert("Please enter a topic...");
      }

    },
    post() {
      var self = this;
      this.get("store").fetchRecord("postingStatus", 1).then((ps) => {
        self.set('post.postingStatus', ps);
        self.doSave();
      });

    },
    cancelPost() {
      this.get("cancelPost")(this.get("post"));
    },
    saveAssign() {
      if (this.get("post.topic.length") > 0 && this.get("cr.content.length") > 0 && !Ember.isEmpty(this.get("cr.assignedToUser.id"))) {

        var self = this;
        this.get("store").fetchRecord("postingStatus", 4).then((ps) => {
          self.set('post.postingStatus', ps);
          self.doSave(true);
        });
      } else {
        alert("Post topic, assignment subject, assignment message and assignee required to save post assignment.");
      }

    },
    assign() {
      var cr = this.get("store").createRecord("changeRequest", {
        'brand': this.get("session.brand")
      });
      this.set("cr", cr);
      this.set('assigning', true);
    },
    cancelAssign() {
      if (this.get("cr").isNew) {
        this.get("deletes").addObject(this.get("cr"));
      }
      this.set("cr", null);
      this.set('assigning', false);

    },

    changeAccounts: function(what) {
      if (what.constructor != Array) {
        var zwat = [];
        zwat.addObject(what);
        what = zwat;
      }
      let component = this;
      let newData = what;
      let oldDataFetch = this.get("socialAccounts"),
        oldData = oldDataFetch.toArray();
      let newItems = [];
      let deletedItems = [];

      newData.forEach(function(newItem) {
        var foundNewItem = false;
        oldData.forEach(function(oldItem) {
          if (oldItem.id === newItem.id) {
            foundNewItem = true;
          }
        });
        if (foundNewItem === false) {
          newItems.push(newItem);
        }
      });

      oldData.forEach(function(oldItem) {
        var foundOldItem = false;
        newData.forEach(function(newItem) {
          if (newItem.id === oldItem.id) {
            foundOldItem = true;
          }
        });
        if (foundOldItem === false) {
          deletedItems.push(oldItem);
        }
      });

      newItems.forEach(function(newItem) {
        component.addSocialAccount(newItem);
      });

      deletedItems.forEach(function(deletedItem) {
        component.deleteSocialAccount(deletedItem);
      });


    },
    addFile(file) {
      this.set("post.file", file);
    },
    removeFile(file) {
      this.set("post.file", null);
    },
    addCRFile(file) {
      this.get("cr.files").addObject(file);
    },
    removeCRFile(file) {
      this.get("cr.files").removeObject(file);
    },
    createTag: function(text) {
      // console.log(text);
      var newTag = this.get('store').createRecord('tag', {
        'name': text,
        'brand': this.get('brand')
      });
      newTag.save();


      this.get('post.tags').addObject(newTag);
      this.get('brand.tags').addObject(newTag);

    },

    removeSocial(ps) {
      if (confirm("Remove schedule from post?")) {
        ps.get('socialAccount').then((account) => {
          this.get('socialAccounts').removeObject(account);
        });

        ps.deleteRecord();
        ps.save();
      }
    }
  }
});
