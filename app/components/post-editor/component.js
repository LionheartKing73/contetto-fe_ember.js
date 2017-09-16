import Ember from 'ember';
const {
    Component,
    get,
    set,
    inject: {
        service
    }
} = Ember;
export default Ember.Component.extend({
    store: Ember.inject.service('store'),
    ajax: Ember.inject.service('ajax'),
    session: Ember.inject.service('session'),
    netTypes: [],
    networkTypes: Ember.computed('netTypes', {get() {
            return this.get('netTypes');
        }
    }),
    assigning: false,
    multiAccount: false,
    hasSchedule: false,
    hasFile: false,
    hasImage: false,
    hasVideo: false,
    hasPending: false,
    deleted: false,
    pending: null,
    hasTeam: false,
    brandMembers: [],
    recommendingObject: null,
    postingScheduleModes: [],
    warningTime: null,
    didInsertElement: function() {
        let _this = this;

        if (this.get('accounts') != null) {
            this.set("hasSchedule", true);
        }

        if (this.get("changeSet.file.id") == null || this.get("changeSet.file.id") == undefined || this.get("changeSet.file.id") == "") {

        }
        else {
            this.set("hasFile", true);
            //alert(this.get("changeSet.file.fileType"));
            this.get("store").fetchRecord("file", this.get("changeSet.file.id")).then((file) => {
                if (file.get("fileType") == "image") {
                    this.set("hasImage", true);
                }
                if (file.get("fileType") == "video") {
                    this.set("hasVideo", true);
                }
            });
        }
        // $(".froala-editor-container").froalaeditor({
        //   imageManagerLoadURL: ""
        // });


    },
    socialAccounts: [],
    willDestroyElement() {
        this._super();
        this.get('changeSet').rollback();
        this.set("assigning", false);
        this.set("multiAccount", false);
        this.set("hasSchedule", false);
        this.set("hasFile", false);
        this.set("hasImage", false);
        this.set("hasVideo", false);
        this.set("hasPending", false);
        this.set("deleted", false);
        this.set("pending", null);
        this.set("hasTeam", false);
        this.set("brandMembers", []);
        this.set("recommendingObject", null);
        this.set("postingScheduleModes", []);
        this.set("warningTime", null);
        this.set("allNow", false);
        this.set("contentLengthOK", false);
        this.set("netTypes", []);
        this.set("thisStep", null);
        this.set("isStep", false);
        this.set("assignedToMe", false);
        this.set("isDepartmentMember", false);
        this.set("isBrandOwner", false);
        this.set("canPost", false);
        this.set("warnRunner", null);
        this.set("socialAccounts", []);
    },

    sas: Ember.computed('socialAccounts', {get() {
            return this.get("socialAccounts");
        }
    }),
    init: function() {
        this._super();
        this.set("deletes", []);
        this.set("assigning", false);
        this.set("multiAccount", false);
        this.set("hasSchedule", false);
        this.set("hasFile", false);
        this.set("hasImage", false);
        this.set("hasVideo", false);
        this.set("hasPending", false);
        this.set("deleted", false);
        this.set("pending", null);
        this.set("hasTeam", false);
        this.set("brandMembers", []);
        this.set("recommendingObject", null);
        this.set("postingScheduleModes", []);
        this.set("warningTime", null);
        this.set("allNow", false);
        this.set("contentLengthOK", false);
        this.set("netTypes", []);
        this.set("thisStep", null);
        this.set("isStep", false);
        this.set("assignedToMe", false);
        this.set("isDepartmentMember", false);
        this.set("isBrandOwner", false);
        this.set("canPost", false);
        this.set("warnRunner", null);

        let component = this;
        this.get("changeSet.postingStatus").then((ps) => {
            if (ps == null) {
                //   console.log("PSNULL");
                component.get('store').fetchRecord('postingStatus', 4).then((ps4) => {
                    component.set("changeSet.postingStatus", ps4);
                });
            }
            else {
                //    console.log("PS: " + JSON.stringify(ps));
            }
        });

        Ember.run.once(this, "updatePSMs");


        if (this.get('nextRecommended') != null) {

            //alert('rec?');
            //recommendations
            var stringified = JSON.stringify(this.get('nextRecommended'));
            var nr = JSON.parse(stringified);

            var ntd = true;
            var type = null;
            if (nr.data.relationships.networkType.data != null) {
                type = nr.data.relationships.networkType.data.id;
            }

            var datetime = nr.data.attributes.dateTime;
            var account = null;
            if (nr.data.relationships.socialAccount.data != null) {
                account = nr.data.relationships.socialAccount.data.id;
            }


            if (type != null && account != null) {
                ntd = false;
                this.get('store').fetchRecord('networkType', type).then((nt) => {
                    component.set('changeSet.networkType', nt);
                    //                alert("Set nt: "+nt.get("name"));
                    if (datetime && account) {
                        component.get('store').fetchRecord('socialAccount', account).then((act) => {
                            component.addSocialAccount(act, datetime);
                        });
                    }

                });
            }

        }


        this.get('store').fetchRecord('networkType', '1').then((nt) => {
            component.get('netTypes').pushObject(nt);
            if (ntd) {
                this.set("changeSet.networkType", nt);
            }
        });
        this.get('store').fetchRecord('networkType', '2').then((nt) => {
            component.get('netTypes').pushObject(nt);
        });

        var iam = this.get("session.data.authenticated.userId");
        this.get('store').fetchRecord('brand', this.get('brandId')).then((brand) => {

            component.set('changeSet.brand', brand);
            component.set("brandMembers", []);
            brand.get('brandMembers').then((members) => {
                //   console.log("brand members!");
                members.forEach(function(member) {

                    member.get("brandRole").then((br) => {
                        //    console.log(member.get("user.id") + " vs" + iam + " @ " + member.get("brandRole.id") + ":" + br.get("name"));
                        if (member.get("user.id") == iam && br.get("name") == "Owner") {
                            //      console.log("Yup! I'm an owner");
                            component.set("isBrandOwner", true);
                        }

                    });
                    member.get('user').then((user) => {
                        component.get('brandMembers').pushObject(user);
                    });
                });
            });

        });


        if (this.get("changeSet.createdBy") == null) {
            //   alert("setting owner...");
            this.get('store').fetchRecord("user", this.get("session.data.authenticated.userId")).then((me) => {
                component.set("changeSet.createdBy", me);
            });

        }






    },
    allOK: false,
    futureTimes() {
        /*global moment*/
        var self = this;
        if (this.get("changeSet.postingSchedules.length") > 0) {
            self.set("allOK", true);
            this.get("changeSet.postingSchedules").map(function(ps) {
                if (!ps.get("now")) {
                    if (!Ember.isEmpty(ps.get("dateTime"))) {
                        //  alert("T1 NOW " + moment().utc() + " SCHED " + moment(ps.get("dateTime")));
                        if (moment().utc() > moment(ps.get("dateTime"))) {
                            //        alert("F1 ");
                            self.set("allOK", false);
                        }
                    }
                    else if (!Ember.isEmpty(ps.get("tempTime"))) {
                        //    alert("T2 " + ps.get("dateTime"));
                        if (moment().utc() > moment(ps.get("tempTime"))) {
                            //    alert("F2");
                            self.set("allOK", false);
                        }
                    }
                    else {
                        if (moment().utc() > moment(ps.get("auto"))) {
                            //      alert("F3");
                            self.set("allOK", false);
                        }
                    }


                }
                else {
                    // alert("N1");
                }
            });
            //  alert(self.get("allOK"));

            return self.get("allOK");

        }
        else {
            //  alert("F0");
            self.set("allOK", false);
            return false;
        }

    },
    CRCheck: function() {
        //    alert("one");
        var component = this;
        var iam = this.get("session.data.authenticated.userId");
        this.get("changeSet.changeRequests").forEach(function(cr) {
            //            alert("two");
            //      alert("Checking changerequests for pending step (" + cr.get("status.name") + ")");
            if (cr.get("status.name") == "Pending" && !Ember.isEmpty(cr.get("channelStep.id"))) {
                //  console.log("yup.. pending step!");
                component.set("isStep", true);
                component.set("thisStep", cr.get("channelStep"));
                component.checkDepartment();
            }
            if (cr.get("status.name") == "Pending" && cr.get("assignedToUser.id") == iam) {
                //        alert("assigned to me!");
                component.set("assignedToMe", true);
            }
        });
        Ember.run.once(this, "teamCheck");

    },
    teamCheck: function() {

        if (this.get("changeSet.brand.brandMembers.length") > 1) {
            //            alert("more");
            this.set("hasTeam", true);

        }
        Ember.run.once(this, "importAccounts");
    },
    importAccounts: function() {
        var self = this;
        self.set("socialAccounts", []);
        //   alert("!");
        //  alert(this.get("changeSet.postingSchedules.length"));
        if (this.get("changeSet.postingSchedules.length")) {
            //   alert("Editor");
            // this.get("store").fetchRecord("posting", this.get("post.id")).then((p) => {

            //  self.set("post", p);
            //   self.set("post.content", p.get("content"));
            self.get("changeSet.postingSchedules").then((pss) => {
                //            alert("pss");
                pss.forEach(function(ps) {
                    //         alert("ps");
                    ps.get("socialAccount").then((psa) => {
                        //    alert("psa");
                        //        alert("apsa " + psa.get("title") + "/" + psa.get("id"));
                        //if(!self.get("socialAccounts").includes(psa)) {
                        self.get("socialAccounts").pushObject(psa);
                        //  }
                    });
                });

                Ember.run.once(this, "setMultiAccountAttributes");
            });
            //  });
        }
    },
    updatePSMs: function() {
        var component = this;
        this.get('store').findAll('postingScheduleMode').then(function(psms) {
            psms.forEach(function(psm) {

                component.get('postingScheduleModes').pushObject(psm);

            });
        });
        if (!this.get("postingScheduleModes").includes({
                "id": null,
                "type": "postingScheduleModes",

                "name": "Use Account Settings"

            })) {
            this.get('postingScheduleModes').pushObject({
                "id": null,
                "type": "postingScheduleModes",

                "name": "Use Account Settings"

            });
        }
        Ember.run.once(this, 'CRCheck');
    },
    allNow: false,
    contentLengthOK: false,
    setAuto: function(item) {
        let component = this;
        this.get('ajax').request('https://gke.contetto.io/postings/v1/postTime?brand=' + component.get('changeSet.brand.id') + '&account=' + item.get('socialAccount.id') + '&type=' + component.get('changeSet.networkType.id')).then(response => {
            var s = JSON.stringify(response);
            var o = JSON.parse(s);
            item.set("auto", o.data.attributes.dateTime);
        });
    },
    thisStep: null,
    isStep: false,
    assignedToMe: false,
    isDepartmentMember: false,
    isBrandOwner: false,
    checkDepartment: function() {
        var self = this;
        //   console.log("Checking step>department to see if im member..");
        if (!Ember.isEmpty(this.get("thisStep.department.id"))) {
            this.get("thisStep.department.departmentMembers").forEach(function(member) {
                if (member.get("user.id") == self.get("session.data.authenticated.userId")) {
                    //             console.log("Yes im a department member");
                    self.set("isDepartmentMember", true);
                }
            });
        }
    },
    canPostCheck: Ember.computed('changeSet.content.length', 'contentLengthOK', 'hasSchedule', 'isBrandOwner', 'isStep', 'isDepartmentMember', 'changeSet.postingSchedules', 'warningTime', {get() {
            Ember.run.once(this, "canIpost");
        }
    }),
    canIpost: function() {
        if (this.futureTimes() === false) {
            this.set("canPost", false);
        }
        else if (this.get("deleted")) {
            this.set("canPost", false);
        }
        else {
            if (this.get("isBrandOwner") && this.get('contentLengthOK') === true && this.get('hasSchedule') === true && this.get('changeSet.content.length') > 0) {
                this.set("canPost", true);
            }
            else {
                if (this.get("isStep")) {
                    if (this.get("isDepartmentMember") && this.get('contentLengthOK') === true && this.get('hasSchedule') === true && this.get('changeSet.content.length') > 0) {
                        this.set("canPost", true);
                    }
                    else {
                        this.set("canPost", false);
                    }
                }
                else {


                    if (this.get('contentLengthOK') === true && this.get('hasSchedule') === true) {
                        this.set("canPost", true);
                    }
                    else {
                        this.set("canPost", false);
                    }
                }
            }
        }

    },
    canPost: false,
    addSocialAccount: function(item, dt) {
        if (!dt) {
            dt = null;
        }
        this.get("socialAccounts").pushObject(item);
        let record = this.get('store').createRecord('postingSchedule', {
            'socialAccount': item,
            'dateTime': null,
            'now': false,
            'auto': null,
            'isPosted': false
        });
        //   record.save();
        this.setAuto(record);
        this.get("changeSet.postingSchedules").pushObject(record);
        this.set("hasSchedule", true);
    },
    deleteSocialAccount: function(item) {
        this.get("socialAccounts").removeObject(item);
        let component = this;
        let aid = item.id;

        var items = this.get('changeSet.postingSchedules'),
            list = items.toArray();
        // alert("dsa");
        list.forEach(function(item) {
            //    alert("item");
            if (item.get('socialAccount.id') === aid) {
                //  alert("match aid " + item.get("isPosted"));
                if (item.get("isPosted")) {
                    //  alert("posted already!");
                }
                else {
                    //   alert("remove request");
                    if (component.get("tempRemove")) {
                        component.get("tempRemove")(item);
                    }
                    component.get("changeSet.postingSchedules").removeObject(item);
                    if (item.get("isNew")) {
                        //                        alert("new!");
                        item.deleteRecord();
                    }
                    else {
                        //                      alert("Not new!");
                        item.deleteRecord();
                        component.get("deletes").pushObject(item);
                    }

                }

            }
        });

    },
    deletes: [],
    doAllNowUpdate: function() {
        var length = this.get("socialAccounts.length");
        if (length == 0) {
            this.set('allNow', false);
        }
        else {

            var allNow = true;
            this.get('changeSet.postingSchedules').forEach(function(ps) {
                if (ps.get('now') === false) {
                    allNow = false;
                }
            });

            this.set('allNow', allNow);

        }
    },
    warnRunner: null,
    changeAccount(what) {
        if (what.constructor != Array) {
            var zwat = [];
            zwat.pushObject(what);
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

        this.setMultiAccountAttributes();
    },

    setMultiAccountAttributes: function() {
        var length = this.get("socialAccounts.length");

        if (length > 1) {
            this.set("multiAccount", true);
        }
        else {
            this.set("multiAccount", false);
        }

        if (length == 0) {
            this.set("hasSchedule", false);
        }
        else {
            this.set("hasSchedule", true);
        }
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
        addSnippet() {
            var text = $(".froala-editor-instance:first").froalaEditor("selection.text");
            var s = this.get("store").createRecord("snippet", {
                'name': text,
                'parent': this.get("changeSet")
            });
            this.get("changeSet.snippets").pushObject(s);
        },
        removeSnippet(s) {
            this.get("changeSet.snippets").removeObject(s);
        },
        setAndSave(html) {
            this.set("changeSet.content", html);
            if (html.length > 0) {
                this.set("contentLengthOK", true);

            }
        },
        updateText(editor) {
            this.set('changeSet.content', editor.root.innerHTML);
            if (editor.root.innerHTML.length > 0) {
                this.set("contentLengthOK", true);
            }
        },

        noFile: function() {
            this.set("changeSet.file", null);
            this.set("hasFile", false);
            this.set("hasImage", false);
            this.set("hasVideo", false);
        },
        updateWarnings: function() {
            const comp = this;
            if (Ember.isBlank(this.get('warnRunner'))) {

                var warnRunner = Ember.run.later((function() {
                    comp.set('warningTime', new Date())
                    comp.set("warnRunner", null);
                }), 2000);
                this.set('warnRunner', warnRunner);
            }
        },
        updateAssigning: function(v) {
            this.set('assigning', v);
        },
        deleting: function() {
            this.set("deleted", true);
        },
        showPending: function(cr) {
            //            alert("Pending " + cr.get("subject"));
            this.set("hasPending", true);
            this.set("pending", cr);
        },
        toDelete: [],
        toAdd: [],
        changeAccounts: function(what) {
            Ember.run.once(this, "changeAccount", what);
            /* let oldDataFetch = this.get("socialAccounts"),
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
             });*/
            /*
                        newItems.forEach(function(newItem) {
                            component.addSocialAccount(newItem);
                        });

                        deletedItems.forEach(function(deletedItem) {
                            //    alert("delete requested...");
                            component.deleteSocialAccount(deletedItem);
                        });
            */
            /*
                       let length = this.get("socialAccounts.length");
                       if (length > 1) {
                           this.set("multiAccount", true);
                       }
                       else {
                           this.set("multiAccount", false);
                       }
                       if (length == 0) {
                           this.set("hasSchedule", false);
                       }
                       else {
                           this.set("hasSchedule", true);
                       }*/
        },
        createTag: function(text) {
            // console.log(text);
            var newTag = this.get('store').createRecord('tag', {
                'name': text,
                'brand': this.get('changeSet.brand')
            });
            newTag.save();


            this.get('changeSet.tags').pushObject(newTag);
            this.get('changeSet.brand.tags').pushObject(newTag);

        },
        contentLimitChanged: function(overlimit) {
            if (overlimit === true) {
                this.set("contentLengthOK", false);
            }
            else {
                this.set("contentLengthOK", true);
            }
        },
        allNowChanged: function() {
            this.doAllNowUpdate();
        },
        addFile: function(file) {
            this.set("changeSet.file", file);
            this.set("hasFile", true);
            this.set("hasImage", false);
            this.set("hasVideo", false);
            if (file.get("fileType") == "image") {
                this.set("hasImage", true);
            }
            if (file.get("fileType") == "video") {
                this.set("hasVideo", true);
            }
        },
        setMultiAccount: function(s) {
            this.set('multiAccount', s);
        }

    }
});
