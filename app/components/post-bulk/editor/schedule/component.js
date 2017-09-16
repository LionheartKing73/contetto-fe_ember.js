import Ember from 'ember';

export default Ember.Component.extend({
    session: Ember.inject.service(),
    store: Ember.inject.service("store"),
    modes: [{
        "name": "Automatic",
        "id": "auto"
    }, {
        "name": "Specify",
        "id": "specify"
    }, {
        "name": "Post Now",
        "id": "now"
    }],
    psmodes: [],
    mode: null,
    selectedpsm: {
        'id': 'default',
        'name': 'Default'
    },
    loaded: false,
    ajax: Ember.inject.service('ajax'),
    init() {
        this.set("loaded", false);
        this._super();
        this.set("psmodes", []);
        this.set("selectedpsm", {
            'id': 'default',
            'name': 'Default'
        });
        // Ember.run.once(this, "setAuto");
    },
    didReceiveAttrs() {
        Ember.run.once(this, "getPSModes");
    },
    getPSModes() {
        var self = this;
        this.get("store").findAll('postingScheduleMode').then((psm) => {
            Ember.RSVP.all(psm.map(function(psmi) {
                self.get("psmodes").pushObject(psmi);
                ///         alert(psmi.get("id") + "/" + JSON.stringify(psmi));

            })).then(function() {
                Ember.run.once(self, "addDefault");
            });

        });
    },
    addDefault() {
        var self = this;
        this.get("psmodes").pushObject({
            'id': 'default',
            'name': 'Default'
        });

        this.get("ps.postingScheduleMode").then((pspsm) => {
            if (Ember.isEmpty(pspsm)) {
                this.set("selectedpsm", {
                    'id': 'default',
                    'name': 'Default'
                });
            }
            else {
                //     alert(pspsm);
                this.set("selectedpsm", this.get("ps.postingScheduleMode"));
            }
            Ember.run.once(self, "setAuto");
        });
    },
    pastTime: Ember.computed('mode', 'ps.dateTime', 'ps.tempTime', function() {
        if (this.get("mode.id") == "auto") {
            if (moment(this.get("ps.tempTime")) <= moment().add(1, "minute")) {
                Ember.run.once(this, 'doUpdateAuto');
                return true;
            }
        }
        else if (this.get("mode.id") == "specify") {
            if (moment(this.get("ps.dateTime")) <= moment().add(1, "minute")) {
                return true;
            }
        }
        return false;

    }),
    setAuto() {
        var self = this;
        if (this.get("ps.isNew")) {
            if (this.get("ps.dateTime") == null) {
                self.set("mode", {
                    "name": "Automatic",
                    "id": "auto"
                });
                this.doAuto();
                self.set("loaded", true);
            }
            else {
                self.set("mode", {
                    "name": "Specify",
                    "id": "specify"
                });
                self.set("loaded", true);
            }
        }
        else {
            if (this.get("ps.id")) {
                this.get("store").fetchRecord("postingSchedule", this.get("ps.id")).then((ps) => {

                    if (ps.get("dateTime") != null) {

                        self.set("mode", {
                            "name": "Specify",
                            "id": "specify"
                        });
                        self.set("loaded", true);
                    }
                    else if (ps.get("tempTime") != null) {
                        self.set("mode", {
                            "name": "Automatic",
                            "id": "auto"
                        });
                        this.doAuto();
                        self.set("loaded", true);
                    }

                    else {
                        self.set("mode", {
                            "name": "Post Now",
                            "id": "now"
                        });
                        self.set("loaded", true);

                    }
                });


            }
        }
    },
    doSetDT(time) {
        this.set("ps.dateTime", time);
        this.get("onchange")(this.get("ps"));
    },


    assocTemps() {
        var assocTemps = [];
        var myNT = this.get("ps.posting.networkType.id");
        var myACC = this.get("ps.socialAccount.id");

        this.get("temps").forEach(function(temp) {
            if (temp.get("posting.networkType.id") == myNT) {

                if (temp.get("dateTime") == "" || temp.get("dateTime") == null) {

                    if (temp.get("socialAccount.id") == myACC) {

                        assocTemps.pushObject(temp);

                    }

                }

            }
        });

        return assocTemps;
    },
    uid: function() {
        var d = new Date().getTime();

        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    },
    doUpdateAuto() {
        var component = this;
        this.get('ajax').request('https://gke.contetto.io/postings/v1/postTime?brand=' + component.get('ps.posting.brand.id') + '&account=' + component.get('ps.socialAccount.id') + '&type=' + component.get('ps.posting.networkType.id')).then(response => {
            var s = JSON.stringify(response);
            var o = JSON.parse(s);
            if (!o.data.attributes.dateTime) {
                component.set('noauto', true);
                component.doSetMode({
                    'value': 'specify',
                    'name': 'Specify Time'
                });
            }
            component.set("ps.tempTime", o.data.attributes.dateTime);

        });

    },
    doAuto() {
        var self = this;
        if (this.get("ps.tempID") == undefined || this.get("ps.tempID") == null || this.get("ps.tempID") == "") {
            this.set("ps.tempID", this.uid());
            this.get("temps").pushObject(this.get("ps"));
        }


        if (this.get("ps.posting.isNew")) {
            var assocTemps = this.assocTemps();
            this.get("ajax").request("https://gke.contetto.io/postings/v1/tempSlots?socialAccount=" + this.get("ps.socialAccount.id") + "&networkType=" + this.get("ps.posting.networkType.id") + "&tempIds=" + assocTemps.map(function(item) {
                return item.get("tempID");
            }).toArray().join(",")).then((resp) => {
                if (resp.length > 0) {
                    for (var i = 0; i < resp.length; i++) {
                        var item = resp[i];
                        self.get("temps").forEach(function(temp) {
                            if (temp.get("tempID") == item.tempId) {
                                temp.set("tempTime", item.dateTime);
                                self.get("onchange")(temp);

                            }
                        });
                    }
                }
            });
        }
    },
    actions: {
        changePSMode(mode) {
            var self = this;
            //  alert(mode.get("id"));
            if (this.get("ps.isPosted")) {

            }
            else {
                console.log(JSON.stringify(mode));
                if (mode.name == "Default") {
                    this.set("ps.postingScheduleMode", null);
                    console.log("Nullified");
                }
                else {
                    this.set("ps.postingScheduleMode", null);
                    this.get('store').findRecord("postingScheduleMode", mode.get("id")).then((m) => {
                        self.set("ps.postingScheduleMode", m);

                    });

                }
                this.set("selectedpsm", mode);
                this.get("onchange")(this.get("ps"));
            }
        },
        updateDT(time) {
            if (this.get("ps.isPosted")) {}
            else {
                Ember.run.once(this, "doSetDT", time);
            }
        },
        changeMode(mode) {
            if (this.get("ps.isPosted")) {}
            else {
                this.set("mode", mode);
                if (this.get("mode.id") == "auto") {
                    this.set("ps.dateTime", null);
                    this.doAuto();
                }
                else {
                    this.set("ps.auto", null);
                }
                if (this.get("mode.id") == "now") {
                    this.set("ps.now", true);
                    this.set("ps.dateTime", null);

                }
                else {
                    this.set("ps.now", false);
                }
            }
        }
    }
});
