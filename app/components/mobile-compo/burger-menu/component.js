import Ember from 'ember';

const {
  Component,
  inject: { service },
  get, set
} = Ember;

export default Component.extend({
  store: service(),
  session: service(),
  sideMenu: service(),

  quickposts: [],

  actions: {
    quickPost: function() {
      var self = this;

      get(this, "store").findRecord("brand", self.get("session.brand.id")).then((brand) => {
        var record = get(self, "store").createRecord("posting", {
          "brand": brand
        });
        get(self, "quickposts").pushObject(record);
        get(self, 'sideMenu').close();
      });
    },

    quickPostDone: function() {
      set(this, "quickposts", []);
    },
  }
});
