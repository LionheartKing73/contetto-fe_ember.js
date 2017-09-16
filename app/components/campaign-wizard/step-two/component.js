import Ember from 'ember';

export default Ember.Component.extend({
    ajax: Ember.inject.service("ajax"),
    store: Ember.inject.service("store"),

    recommendedAccounts: [],
    recommendedPlatforms: [],
    hasPlatforms: false,
    init() {
        return this._super();
    },
    didInsertElement: function() {
        if (!Ember.isEmpty(this.get("brand.id"))) {
            Ember.run.once(this, 'getacclist');

        }

    },
    getacclist() {
        var self = this;
        if (this.get("campaign.socialAccounts.length") == 0) {


            this.get("ajax").request("https://gke.contetto.io/campaigns/v1/recommendingAccounts?brand=" + this.get("campaign.brand.id") + "&goal=" + this.get("campaign.goal.id") + "&product=" + this.get("campaign.product.id")).then((resp) => {
                if (resp.data.length > 0) {
                    resp.data.map(function(saccount) {
                        self.get("store").fetchRecord("socialAccount", saccount.id).then((account) => {
                            self.get("recommendedAccounts").pushObject(account);
                            self.get("campaign.socialAccounts").pushObject(account);
                        });
                    });
                }
                self.getpflist();
            });
        }
    },
    getpflist() {
        var self = this;

        this.get("ajax").request("https://gke.contetto.io/campaigns/v1/recommendingPlatforms?brand=" + this.get("campaign.brand.id") + "&goal=" + this.get("campaign.goal.id") + "&product=" + this.get("campaign.product.id")).then((resp) => {
            if (resp.data.length > 0) {

                resp.data.map(function(platform) {
                    if (platform.name != "linkedin" && platform.name != "gplus" && platform.name != "instagram") {
                        self.get("recommendedPlatforms").push(platform);
                    }
                });
            }
        });


    },
    actions: {
        previousStep() {
            this.get("previousStep")();
        },
        nextStep() {
            this.get("nextStep")();
        }
    }
});
