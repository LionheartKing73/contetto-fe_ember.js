import Ember from 'ember';

export default Ember.Component.extend({
    ajax: Ember.inject.service("ajax"),
    response: null,
    init() {
        this._super();
        this.set("response", "");
    },
    didReceiveAttrs() {
        var self = this;
        this.get("ajax").request(this.get("url")).then(function(response) {
            self.set("response", JSON.stringify(response));
        });
    }
});
