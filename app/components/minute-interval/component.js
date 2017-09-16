import Ember from 'ember';

export default Ember.Component.extend({
    store: Ember.inject.service("store"),
    frequencies: [],
    myval: 0,
    init() {
        var component = this;
        this.get("store").findAll("frequency").then((fs) => {

            //console.log("FS: " + fs.get("id"));
            fs.map(function(f) {
                //   console.log("F:" + JSON.stringify(f));
                if (f.get("name") == "Minute" || f.get("name") == "Hour" || f.get("name") == "Day") {

                    if (!component.get("frequencies").includes(f)) {
                        component.get("frequencies").pushObject(f);
                        if (f.get("name") == "Minute") {
                            if (Ember.isEmpty(component.get("frequency.id"))) {
                                //      console.log("setminute");
                                component.set("frequency", f);
                                Ember.run.once(component, "initialDivision");
                            }
                            else {
                                //    console.log("minuteset");
                            }
                        }
                    }
                }
                else {
                    //   console.log("NAME: " + f.get("name") + "/" + f.get("id"));
                }

            });
        });



        return this._super();
    },
    didInsertElement() {
        Ember.run.once(this, "initialDivision");
    },
    initialDivision() {
        if (!Ember.isEmpty(this.get("frequency.id"))) {
            if (this.get("value") == 0 || isNaN(this.get("value"))) {
                return 0;
            }
            else {
                //     console.log("dividing ...");
                var f = this.fMultiplier;
                var v = this.get("value");
                this.set("myvalue", Math.floor(v / f));
            }
        }
        else {
            //  console.log("no frequency to divide");
            return 0;
        }
    },
    calc: Ember.computed('frequency', 'myval', {get() {
            if (!Ember.isEmpty(this.get("frequency.id"))) {
                var f = this.fMultiplier();
                var v = this.get("myval");
                var result = Math.ceil(f * v);
                this.get("onchange")(result);
                return result;
            }
            else {
                //  console.log("frequency empty");
                return 0;
            }
        }
    }),
    fMultiplier: function() {
        var f = this.get("frequency");
        if (f.get("name") == "Minute") {
            return 1;
        }
        else if (f.get("name") == "Hour") {
            return 60;
        }
        else if (f.get("name") == "Day") {
            return 1440;
        }
        else {
            return 1;
        }

    },
    actions: {

        updateFrequency(f) {
            this.set("frequency", f);
        },
        updateMyval(v) {
            this.set("myval", v);
        }
    }
});
