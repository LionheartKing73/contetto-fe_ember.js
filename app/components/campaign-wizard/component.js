import Ember from 'ember';

export default Ember.Component.extend({
    store: Ember.inject.service("store"),
    session: Ember.inject.service("session"),
    activeStep: 1,
    hasProduct: false,
    willDestroyElement() {
        this._super();

        this.get("campaign").rollbackAttributes();

    },

    productGoal: Ember.computed('campaign.goal', {get() {
            if (this.get("campaign.goal.name") == "ProductPromotion") {
                return true;
            }
            else {
                return false;
            }
        }
    }),
    step1done: Ember.computed('campaign.name', 'campaign.goal', 'campaign.product', {get() {
            if (this.get("productGoal")) {
                if (!Ember.isBlank(this.get("campaign.name")) && !Ember.isBlank(this.get("campaign.goal.id")) && !Ember.isBlank(this.get("campaign.product.id"))) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                if (!Ember.isBlank(this.get("campaign.name")) && !Ember.isBlank(this.get("campaign.goal.id"))) {
                    return true;
                }
                else {
                    return false;
                }

            }
        }
    }),
    step2done: Ember.computed('campaign.socialAccounts', 'step1done', {get() {
            return true;
            if (this.get("campaign.socialAccounts.length") > 0 && this.get("step1done")) {
                return true;
            }
            return false;
        }
    }),
    step3done: false,
    s3dcheck: Ember.computed("campaign.lengthNumber", "campaign.startDate", {get() {
            Ember.run.once(this, "dos3dcheck");
        }
    }),
    dos3dcheck: function() {
        // console.log("d3 check");
        //    if (this.get("campaign.lengthNumber") > 0 && !isNaN(this.get("campaign.lengthNumber")) &&
        //       this.get("campaign.startDate") != null && this.get("campaing.startDate") != "" && this.get("step1done") && this.get("step2done")) {
        this.set("step3done", true);
        //  }
        //        else {
        //           this.set("step3done", false);
        //     }
    },

    init() {
        var self = this;
        if (Ember.isBlank(this.get("campaign.brand.id"))) {
            self.set("campaign.brand", self.get("brand"));
        }
        Ember.run.once(this, "productCheck");

        return this._super();
    },
    productCheck() {
        if (this.get("products.length") > 0) {
            this.set("hasProduct", true);
        }
        Ember.run.once(this, "categoryCheck");
    },
    categoryCheck() {
        if (this.get("brand.categories.length") > 0) {
            this.set("hasCategories", true);
        }
    },
    setChatRoom(campaign) {
        var self = this;
        if (campaign.get("room.id")) {
            this.get("store").findRecord("chatRoom", this.get("campaign.room.id")).then((chatRoom) => {
                chatRoom.set("name", "Discuss Campaign: " + self.get("campaign.name") + " ~" + self.get("campaign.id"));

                chatRoom.save();
            });
        }
        else {
            this.get("store").fetchRecord("user", this.get("session.data.authenticated.userId")).then((me) => {

                var chatRoom = self.get("store").createRecord("chatRoom", {
                    brand: self.get("campaign.brand"),
                    name: "Discuss Campaign: " + self.get("campaign.name") + " ~" + self.get("campaign.id"),
                    campaign: campaign
                });
                chatRoom.get("users").pushObject(me);
                chatRoom.save().then((chatroom) => {
                    campaign.set("room", chatroom);
                    campaign.save();
                });
            });
        }
    },
    doSave(next) {
        var self = this;
        this.get("campaign").save().then(function(c) {
            self.setChatRoom(c);
            alert("Saved!");
            if (next == "exit") {
                self.get("router").transitionTo("brand.edit.campaigns.list", self.get("brand"));
            }
            else {
                self.get("router").transitionTo("brand.edit.campaigns.schedule", self.get("brand"), c.get("id"), {
                    queryParams: {
                        generate: 'yes'
                    }
                });
            }
        });
    },
    actions: {
        recheck() {
            Ember.run.once(this, "dos3dcheck");

        },
        nextStep() {
            if (this.get("activeStep") == '1') {
                if (this.get("step1done")) {

                    this.set("activeStep", 4);
                }
            }
            else if (this.get("activeStep") == '2') {
                if (this.get("step1done") && this.get("step2done")) {
                    this.set("activeStep", 3);
                    Ember.run.once(this, "dos3dcheck");
                }
            }
            else if (this.get("activeStep") == '3') {
                if (this.get("step1done") && this.get("step2done") && this.get("step3done")) {
                    this.set("activeStep", 4);
                }
            }
            else if (this.get("activeStep") == '4') {
                this.doSave('continue');
            }
        },

        previousStep() {
            if (this.get("activeStep") == '4') {
                this.set("activeStep", 1);
            }
            //            this.set("activeStep", (this.get("activeStep") - 1));
        },
        saveCampaign() {
            this.doSave('exit');
        }
    }
});
