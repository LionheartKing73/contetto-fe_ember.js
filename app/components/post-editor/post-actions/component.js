import Ember from 'ember';





export default Ember.Component.extend({
    store: Ember.inject.service('store'),
    session: Ember.inject.service('session'),
    assigning: false,
    assignee: null,
    saving: false,
    deleted: false,
    toast: Ember.inject.service('toast'),
    postOwner: Ember.computed('changeSet.createdBy', 'session.data.authenticated.userId', {get() {
            var owner = this.get("changeSet.createdBy.id");
            var iam = this.get("session.data.authenticated.userId");
            //            alert("Iam: " + iam + " Owner: " + owner);
            if (iam == owner) {
                return true;
            }
            else {
                return false;
            }
        }
    }),

    myCR: null,
    crPendingStatus: {
        "data": {
            "type": "changeRequestStatuses",
            "id": "1"
        }
    },
    crCompleteStatus: {
        "data": {
            "type": "changeRequestStatuses",
            "id": "2"
        }
    },

    ajax: Ember.inject.service('ajax'),
    init: function() {

        let _this = this;



        this._super();
        this.set("saving", false);
    },
    rts: false,
    pending: null,
    hasPending: false,
    assignButtonClass: "btn-primary",
    assignButtonText: "Assign as Task",
    assignHeading: "Assign as Task",
    assignPreselect: null,
    assignButtonVisible: true,
    assignedByMe: false,
    assignCR: null,

    assignSubmitText: "Submit Assignment",
    setButtonContext: Ember.computed('hasPending', 'postOwner', 'rts', 'assignedByMe', {get() {
            Ember.run.once(this, 'processButtonContext');
            return true;

        }
    }),

    processButtonContext: function() {
        var self = this;
        self.set("assignCR", null);
        if (self.get('hasTeam') === false) {
            self.set("assignButtonVisible", false);
            return;
        }
        if (self.get('hasPending') === false) {
            if (self.get('postOwner')) {
                self.set("assignButtonClass", "btn-primary");
                self.set("assignButtonText", "Assign as Task");
                self.set("assignHeading", "Assign as Task");
                self.set("assignPreselect", null);
                self.set("assignButtonVisible", true);
                self.set("assignSubmitText", "Submit Assignment");
            }
            else {
                self.set("assignButtonClass", "btn-info");
                self.set("assignButtonText", "Suggest a Change");
                self.set("assignHeading", "Suggest a Change");
                self.set("assignPreselect", self.get("changeSet.createdBy"));
                self.set("assignButtonVisible", true);
                self.set("assignSubmitText", "Submit Change Request");

            }
        }
        else {
            if (self.get('rts')) {
                if (self.get('assignedByMe')) {
                    self.set("assignButtonClass", "btn-primary");
                    self.set("assignButtonText", "Reassign");
                    self.set("assignHeading", "Reassign");
                    self.set("assignPreselect", null);
                    self.set("assignButtonVisible", true);
                    self.set("assignSubmitText", "Send Assignment");

                }
                else {
                    self.set("assignButtonClass", "btn-success");
                    self.set("assignButtonText", "Respond to Assignment");
                    self.set("assignHeading", "Respond to Request");
                    self.set("assignPreselect", self.get("pending.requestBy"));
                    self.set("assignButtonVisible", true);
                    self.set("assignSubmitText", "Submit Response");

                }
            }
            else {
                if (self.get('assignedByMe')) {
                    self.set("assignButtonClass", "btn-info");
                    self.set("assignButtonText", "Update Assignment");
                    self.set("assignHeading", "Update Assignment");
                    self.set("assignPreselect", self.get("pending.assignedToUser"));
                    self.set("assignCR", self.get("pending"));
                    self.set("assignButtonVisible", true);
                    self.set("assignSubmitText", "Send Assignment");

                }
                else {
                    if (self.get('postOwner')) {
                        self.set("assignButtonClass", "btn-warning");
                        self.set("assignButtonText", "Reassign");
                        self.set("assignHeading", "Reassign");
                        self.set("assignPreselect", self.get("pending.assignedToUser"));
                        self.set("assignButtonVisible", true);
                        self.set("assignSubmitText", "Send Assignment");

                    }
                    else {
                        self.set("assignButtonVisible", false);
                    }
                }
            }
        }
    },
    mytest: Ember.computed('changeSet.changeRequests', {get() {
            if (this.get("deleted")) {
                return false;
            }
            let component = this;
            var iam = component.get("session.data.authenticated.userId");
            var cs = this.get("changeSet");
            this.get("changeSet.changeRequests").map(function(cr) {

                if (typeof(cr.get("id")) == "string") {
                    // alert("string");

                    component.get('store').findRecord('changeRequest', cr.get('id')).then((crr) => {
                        //  alert("has1");
                        component.get('store').fetchRecord('changeRequestStatus', crr.get('status.id')).then((crrs) => {
                            // alert("has2");
                            if (crrs.get('name') == "Pending") {
                                //      alert("isPending");
                                //                          alert(crr.get('assignedToUser.id'));
                                //                            alert("iam" + iam);
                                component.get("foundPending")(crr);
                                component.set("hasPending", true);
                                if (crr.get("requestBy.id") == iam) {
                                    component.set("assignedByMe", true);
                                }
                                if (crr.get('assignedToUser.id') == iam) {

                                    component.set("rts", true);

                                    //                            alert("1" + component.get("changeSet.user.id"));
                                    //                          alert("2" + crr.get('assignedToUser.id'));
                                    //                        alert("3" + component.get('session.data.authenticated.userId'));

                                }
                                else {
                                    //   alert("not assigned to me");
                                }
                                component.set("pending", crr);
                            }
                        });
                    });
                }
                else {
                    //     console.log("Cr is new ");
                }
            });

        }
    }),
    didInsertElement: function() {

    },
    pendingRequest: function() {

        let mycr = "no";
        this.get("changeSet.changeRequests").forEach(function(cr) {
            //   console.log("A cr");
            if (cr.get("status.name") == "Pending") {
                //   console.log('pending!');
                mycr = "yes";
            }
            else {
                //     console.log('not pending: ' + cr.get('status'));
            }


        });
        return mycr;
    },
    doSave: function() {
        let self = this;
        this.set("saving", true);
        //console.log(JSON.stringify(self.get("changeSet")));
        //        alert("0");
        var me = self.get("session.data.authenticated.userId");
        self.get('changeSet').save().then((cs) => {
            self.saveChangeRequests(cs);

        });


    },
    saveChangeRequests(cs) {

        var self = this;

        Ember.RSVP.all(self.get('changeSet.changeRequests').map(function(cr) {
            // alert("Saving changeRequests");
            //   alert(cr.get("id"));
            cr.set('posting', cs);
            if (cr.get('id') != self.get("myCR.id") && cr.get("status.id") != '2' && cs.get("isDraft") != true) {

                return self.get('store').findRecord('changeRequestStatus', 2).then((status) => {
                    //   alert("updating a cr status..");
                    cr.set("status", status);
                    return cr.save();
                });
            }
            return cr.save();

        })).then(function() {
            if (self.get('myCR') != null) {
                self.saveMyCR(cs);
            }
            else {
                self.savePS(cs);
            }
        });
    },
    saveMyCR(cs) {

        var self = this;
        self.set('myCR.posting', cs);
        self.get('myCR').save().then(function() {
            Ember.RSVP.all(self.get('changeSet.postingSchedules').map(function(item) {
                // alert("Updating our posting schedules..");
                item.set("posting", cs);
                return item.save();
            })).then(function() {
                self.saveDeletes(cs);
            });
        });
    },
    savePS(cs) {

        var self = this;
        Ember.RSVP.all(self.get('changeSet.postingSchedules').map(function(item) {
            // alert("updating our posting schedules...");
            item.set("posting", cs);
            return item.save();
        })).then(function() {
            self.get('toast').success('Post saved.');
            self.get('store').findRecord('posting', cs.get('id')).then((cs) => {
                if (cs.get("isDraft")) {
                    self.get('store').findRecord('postingStatus', 4).then((ps4) => {
                        //          alert("ps4-2");
                        cs.set('postingStatus', ps4);
                        cs.save().then(function() {
                            self.get('store').findRecord('posting', cs.get('id')).then((cs) => {
                                self.set("saving", false);

                                self.get("router").transitionTo("brand.edit.post.drafts", cs.get("brand"));
                            });
                        });
                    });
                }
                else {
                    self.set("saving", false);

                    self.get("router").transitionTo("brand.edit.assignments.assigned", cs.get("brand"));
                }
            });
        });

    },

    saveDeletes(cs) {
        var self = this;
        if (this.get("deletes.length") > 0) {
            Ember.RSVP.all(this.get("deletes").map(function(item) {

                item.deleteRecord();
                return item.save().then(function(item) {
                    self.get("deletes").removeObject(item);
                }).catch(function(e) {});
            })).then(function() {
                //    alert("Saved!");
                self.savePS(cs);
            });
        }
        else {
            //            alert("Saved!");
            self.savePS(cs);
        }
    },
    actions: {
        cancel: function() {
            if (confirm("Are you sure you want to delete this post?")) {
                var brand = this.get("changeSet.brand");
                var component = this;
                this.set("deleted", true);
                this.get("deleteAction")();
                if (Ember.typeOf(this.get("myCR")) == "object") {
                    this.get("myCR").deleteRecord();
                    this.get("myCR").save();
                }
                this.get("changeSet.postingSchedules").map(function(ps) {
                    ps.deleteRecord();
                    ps.save();
                });
                this.get("changeSet.changeRequests").map(function(cr) {
                    cr.deleteRecord();
                    cr.save();
                });
                if (!this.get("changeSet").isNew) {
                    let cs = this.get("store").peekRecord("posting", this.get("changeSet.id"));
                    cs.deleteRecord();
                    cs.save().then(() => {
                      alert("Post deleted!");
                      component.get("router").transitionTo("brand.edit.dashboard", brand);
                    });
                }
                else {
                    alert("Post was nuked!");
                    component.get("router").transitionTo("brand.edit.dashboard", brand);

                }
            }
            else {
                alert("Sounds good! Post is left untouched.");
            }
        },
        updateTime: function(time) {
            //     alert("Setting request due: " + time);
            this.set('myCR.requestDue', time);
        },
        addCRFile: function(file) {
            this.get("myCR.files").pushObject(file);
        },
        removeCRFile: function(file) {
            this.get("myCR.files").removeObject(file);
        },
        schedulePost: function() {
            let self = this;
            this.set("changeSet.isDraft", false);
            this.get('store').fetchRecord("postingStatus", 1).then((sps) => {
                self.set("changeSet.postingStatus", sps);
                self.doSave();
            });
        },
        saveDraft: function() {

            var comp = this;
            this.set('changeSet.isDraft', true);
            this.get("store").fetchRecord("postingStatus", 4).then((ps) => {
                comp.set('changeSet.postingStatus', ps);
            });
            this.doSave();
        },
        saveAssignment: function() {
            let self = this;
            this.set("changeSet.isDraft", false);
            this.get('store').fetchRecord('postingStatus', 4).then((sps) => {
                self.set("changeSet.postingStatus", sps);
                self.doSave();
            });

        },
        setAssignee: function(user) {
            var pr = this.get('myCR');
            pr.set("assignedToUser", user);

            this.set("assignee", user);
        },
        assign: function(ps, cr) {

            if (ps) {
                this.set("assignee", ps);
            }

            if (cr) {
              this.set("myCR", cr);
              if (this.get("isStep")) {
                  record.set("step", this.get("thisStep"));
              }
              this.set("assigning", true);
              this.get('assigningChange')(true);
              return;
            }
            var record = this.get('store').createRecord('changeRequest', {
                'brand': this.get("session.brand"),
                'posting': this.get("changeSet"),
                'assignedToUser': ps

            });
            this.get('store').fetchRecord('changeRequestStatus', 1).then((css) => {
                record.set("status", css);
            });

            this.set("myCR", record);
            if (this.get("isStep")) {
                record.set("step", this.get("thisStep"));
            }
            this.set("assigning", true);
            this.get('assigningChange')(true);
        },
        dontAssign: function() {
            var cr = this.get('myCR');

            if (cr.get('isNew')) {
              cr.deleteRecord();
              cr.save();
            }

            this.set('myCR', null);
            this.set("assigning", false);
            this.get('assigningChange')(false);
        }

    }
});
