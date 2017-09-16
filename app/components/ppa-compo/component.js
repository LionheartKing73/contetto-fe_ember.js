import Ember from 'ember';

export default Ember.Component.extend({
    ajax: Ember.inject.service('ajax'),
    session: Ember.inject.service("session"),
    fromDate: moment(new Date()).subtract('2', 'weeks').utc().format(),
    endDate: moment(new Date()).utc().format(),
    quickpost: Ember.inject.service("quickpost"),
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
        this.get("ajax").request("https://gke.contetto.io/postings/v1/performanceMetrics?startDate=" + this.get("fromDate") + "&endDate" + this.get("endDate") + "&brand=" + this.get("session.brand.id")).then(function(data) {

            data.map(function(item) {
                self.get("store").fetchRecord("postingSchedule", item.postingSchedule).then((ps) => {

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
    },

    columns: [{
        "propertyName": "ps.posting.topic",
        "title": "Topic",
        "component": "ppa-compo/topic-cell"
    }, {
        "propertyName": "ps.socialAccount.title",
        "title": "Account"
    }, {
        "propertyName": "ps.posting.networkType.name",
        "title": "Type"
    }, {
        "propertyName": "age",
        "title": "Age"
    }, {
        "propertyName": "avg",
        "title": "Avg"
    }, {
        "propertyName": "interactions",
        "title": "Engagement"
    }, {
        "propertyName": "perc",
        "title": "Perc"
    }]

});
