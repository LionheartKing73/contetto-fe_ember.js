import Ember from 'ember';

const {
  Component,
  get,
  set,
  computed,
  inject: {
    service
  }
} = Ember;

export default Component.extend({
  toast: service(),
  store: service(),
  deletes: [],
  plp: null,
  hasPLP: false,
  resetAll() {
    this.set("plp", null);
    this.set("hasPLP", false);
    this.set("deletes", []);
    Ember.run.once(this, "PLPCheck");
  },
  init() {

    this._super();
    Ember.run.once(this, "resetAll");


  },
  disableSave: computed('isSaving', {get() {
      return this.get("isSaving");
    }
  }),
  didInsertElement() {



  },
  didUpdateAttrs() {

  },

  PLPCheck() {
    //    alert("PLCHECK");
    if (!Ember.isEmpty(this.get("changeset.primaryLandingPage.id"))) {
      this.set("hasPLP", true);
      this.set("plp", this.get("changeset.primaryLandingPage"));
    }
  },
  isShippingProduct: false,

  addSubscription: function() {
    var s = this.get("store").createRecord("subscriptionPrice", {
      'product': this.get("changeset")
    });
    this.get("changeset.subscriptionPrices").pushObject(s);
  },
  addLPPrimary: function() {
    // alert("2");
    if (!this.get("hasPLP")) {
      //  alert("3");

      var record = this.get("store").createRecord("landingPage", {
        'product': this.get("changeset")
      });
      this.set("changeset.primaryLandingPage", record);
      this.set("hasPLP", true);
      this.set("plp", record);
    }
  },
  removeLPPrimary: function() {
    // alert("2");
    if (this.get("hasPLP")) {
      //  alert("3");

      this.set("changeset.primaryLandingPage", null);
      this.set("hasPLP", false);
      this.set("plp", null);
    }
  },
  addLP: function() {
    var record = this.get("store").createRecord("landingPage", {
      'product': this.get("changeset")
    });
    this.get("changeset.landingPages").pushObject(record);
  },
  updatePT: function(pt) {
    this.set("changeset.pricingType", pt);
    if (pt.get("name") == "One time" || pt.get("name") == "Subscription") {
      this.set("changeset.ratePrice", null);
      this.set("changeset.rateFrequency", null);
    }
    if (pt.get("name") == "One time" || pt.get("name") == "Rate") {
      this.set("changeset.subscriptionPices", null);
    }
    if (pt.get("name") == "Rate" || pt.get("name") == "Subscription") {
      this.set("changeset.oneTimePrice", null);
    }
  },
  saveChangeset: function() {
    var compo = this;
    var changeset = this.get("changeset");
    if (changeset.get('isValid')) {
      set(this, 'isSaving', true);
      changeset.save()
        .then((cs) => {
          if (compo.get("hasPLP")) {
            compo.get("plp").then(function(lp) {
              lp.set("product", cs);
              lp.save().then((plp) => {
                cs.set("primaryLandingPage", plp);
                cs.save().then(() => {
                  compo.saveLandingPages();
                });
              });
            });
          }
          else {
            compo.saveLandingPages();
          }
        });
    }

  },
  saveLandingPages: function() {
    var compo = this;
    var cs = this.get("changeset");
    if (compo.get("changeset.landingPages.length") > 0) {

      Ember.RSVP.all(compo.get("changeset.landingPages").map(function(lp) {
        lp.set("product", cs);
        return lp.save();
      })).then(() => {
        compo.saveSubscriptionPrices();
      });
    }
    else {
      compo.saveSubscriptionPrices();
    }

  },
  saveSubscriptionPrices: function() {
    var compo = this;


    if (compo.get("changeset.subscriptionPrices.length") > 0) {
      Ember.RSVP.all(compo.get("changeset.subscriptionPrices").map(function(sp) {
        return compo.get("store").findRecord("product", compo.get("changeset.id")).then((p) => {
          sp.set("product", p);
          return sp.save();
        });
      })).then(() => {
        compo.saveDeletes();
      });
    }
    else {
      compo.saveDeletes();
    }
  },
  saveDeletes: function() {
    var compo = this;

    if (compo.get("deletes.length") > 0) {
      Ember.RSVP.all(compo.get("deletes").map(function(di) {
        return di.save();
      })).then(() => {
        compo.finally();
      });

    }
    else {
      compo.finally();
    }
  },
  finally: function() {
    get(this, 'toast').success('Product saved successfully!', 'Success');

    set(this, 'isSaving', false);
    this.transitionTo("brand.edit.products.list", this.get("changeset.brand.id"));

  },
  actions: {
    setShip(ship) {
      var self = this;
      this.set("changeset.deliveries", ship);
      if (this.get('changeset.deliveries.length') > 0) {
        var names = this.get('changeset.deliveries').toArray().map(function(d) {
          return d.get('name');
        });
        //  alert(names.join(", "));
        if (names.includes("Shipped")) {
          self.set("isShippingProduct", true);
          return;
        }
      }
      self.set("isShippingProduct", false);

    },
    addPrimaryLP: function() {
      //   alert("1");

      Ember.run.once(this, "addLPPrimary");
    },
    removePrimaryLP: function() {
      //   alert("1");

      Ember.run.once(this, "removeLPPrimary");
    },
    removeLP: function(lp) {
      this.get('changeset.landingPages').removeObject(lp);
      this.get("deletes").pushObject(lp);
    },
    addLP: function() {
      Ember.run.once(this, "addLP");
    },
    removeSubscription: function(s) {
      this.get("changeset.subscriptionPrices").removeObject(s);
      this.get("deletes").pushObject(s);
    },
    addSubscription: function() {
      Ember.run.once(this, 'addSubscription');
    },
    updatePricingType: function(pt) {
      Ember.run.once(this, "updatePT", pt);



    },
    uploadFeatured: function(file) {
      this.set("changeset.primaryPhoto", file);
    },
    uploadOthers: function(file) {
      this.get("changeset.photos").pushObject(file);
    },
    removeFeaturedFile: function(file) {
      this.set("changeset.primaryPhoto", null);
    },
    removeOtherFile: function(file) {
      this.get("changeset.photos").removeObject(file);
    },
    cancel(changeset) {
      changeset.rollback();
      this.transitionTo("brand.edit.products.list", this.get("changeset.brand.id"));
    },
    save(changeset) {
      var compo = this;

      changeset.validate().then(() => {
        if (compo.get("hasPLP")) {
          compo.get("changeset.primaryLandingPage").then(function(lp) {
            lp.set("product", compo.get("changeset"));
            lp.save().then(() => {
              compo.saveChangeset();
            });
          });
        }
        else {
          this.saveChangeset();
        }
      });
    }
  }
});
