import Ember from 'ember';

export default Ember.Component.extend({
    ajax: Ember.inject.service('ajax'),
    session: Ember.inject.service("session"),

    didReceiveAttrs() {
        this._super();
        this.set("items", []);
        this.set("op", "");
        Ember.run.once(this, "getPPA");
    },
    store: Ember.inject.service('store'),
    items: [],
    op: "",
    getPPA() {
        var self = this;
        this.get("ajax").request("https://gke.contetto.io/postings/v1/performanceMetrics?postingSchedule=" + this.get("ps.id")).then(function(data) {
            console.log("D" + JSON.stringify(data));
            data.map(function(item) {
                self.get("store").fetchRecord("postingSchedule", item.postingSchedule).then((ps) => {
                    console.log("ITEM");
                    self.get("items").pushObject({
                        'ps': ps,
                        'age': item.age,
                        'avg': item.avg,
                        'interactions': item.interactions,
                        'perc': item.perc
                    });
                });
                //                    "postingSchedule":"59362da2abeade000112d10b","age":1,"avg":1,"interactions":1,"perc":100
            });

        });
    }
});
