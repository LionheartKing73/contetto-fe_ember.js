import Ember from 'ember';

/* global FreshWidget */

export default Ember.Component.extend({
  quickpost: Ember.inject.service('quickpost'),
  session: Ember.inject.service('session'),
  actions: {
    help(title) {
      alert("Help with " + title + " will be available soon");
    },
    tutorial(title) {
      alert("Tutorials regarding " + title + " will be available soon");
    },
    quickpost() {
      if (this.get("session.brand.id")) {
        this.get('quickpost').quickPost();
      }
    },
    quickblog() {
      if (this.get("session.brand.id")) {
        this.get('quickpost').quickBlog();
      }
    },
    support() {
      FreshWidget.init("", {
        "queryString": "&widgetType=popup&screenshot=no",
        "widgetType": "popup",
        "buttonText": "Support",
        "buttonColor": "white",
        "buttonBg": "#006063",
        "backgroundImage": "",
        "alignment": "4",
        "offset": "-1500px",
        "formHeight": "500px",
        "url": "https://support.contetto.com"
      });
      FreshWidget.show();
      return false;
    }
  }
});
