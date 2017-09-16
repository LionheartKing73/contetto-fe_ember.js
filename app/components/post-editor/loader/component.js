import Ember from 'ember';
import PostingValidations from 'contetto/validations/posting';

export default Ember.Component.extend({
    accounts: [],
    lastTime: 1000,
    lastNow: 1000,
    isMulti: false,
    postMode: 'same',
    allNow: true,
    allAuto: true,
    loading: true,
    store: Ember.inject.service('store'),
    init() {
        this._super();
        this.set("accounts", []);
        this.set("lastTime", 1000);
        this.set("lastNow", 1000);
        this.set("isMulti", false);
        this.set("postMode", 'same');
        this.set("allNow", true);
        this.set("allAuto", true);
        this.set("loading", true);

        if (this.get("changeSet.isDirty")) {
            this.get("changeSet").rollback();
        }

        let component = this;
        this.set("changeSet.socialAccounts", []);
        this.set("accounts", []);
        if (this.get("changeSet.postingSchedules.length") > 1) {
            this.set("isMulti", true);
            //    alert('ismulti true');
        }
        if (this.get("changeSet.postingSchedules.length") > 0) {
            Ember.RSVP.all(this.get("changeSet.postingSchedules").map(function(item) {
                //     console.log(item);
                //   console.log(item.get('id'));
                //   console.log(item.get('dateTime') + "/" + item.get("socialAccount.id"));
                if (item.get("id") != null && item.get("id") != "") {
                    return component.get('store').findRecord("postingSchedule", item.get('id')).then((ps) => {
                        if (ps.get("dateTime") != null && ps.get("dateTime") != "" && ps.get("dateTime") != undefined) {
                            //                  alert("Found dt: " + ps.get("dateTime"));
                            if (ps.get('tempTime')) {
                                //                        alert("Found tmp too! " + ps.get("tempTime"));
                                ps.set("tempTime", null);
                                ps.save();
                            }
                        }
                        component.get('accounts').pushObject(ps.get("socialAccount"));
                        if (component.get('lastNow') == 1000) {
                            component.set('lastNow', ps.get('now'));
                        }
                        else {
                            component.set('isMulti', true);
                            if (component.get('lastNow') != ps.get('now')) {
                                component.set('postMode', 'different');
                            }
                        }
                        if (component.get('lastTime') == 1000) {
                            //   alert("lt1000");

                            var dt = ps.get('dateTime');
                            component.set('lastTime', dt);
                            //    alert(dt);
                            //   alert(component.get('lastTime'));
                        }
                        else {
                            //   alert("not1000" + component.get('lastTime'));
                            if (component.get('lastTime') != ps.get('dateTime')) {
                                //     alert("not the same");
                                component.set('postMode', 'different');
                            }
                        }

                        if (ps.get('now') === false) {
                            component.set('allNow', false);
                        }
                        else {
                            //  alert(ps.get('now'));
                        }
                        if (ps.get('dateTime') != null) {
                            component.set('allAuto', false);
                        }
                        //  alert(ps.get('dateTime'));
                        if (ps.get("isPosted")) {
                            component.set('isMulti', true);
                            component.set("postMode", "different");
                            component.set('allNow', false);
                            component.set('allAuto', false);

                        }

                    });
                }
                return true;
            })).then(() => {
                component.set("loading", false);
            });
        }
        else {
            component.set("loading", false);
        }
    }

});
