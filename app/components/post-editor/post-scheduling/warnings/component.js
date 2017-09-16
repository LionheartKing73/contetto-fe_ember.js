import Ember from 'ember';

export default Ember.Component.extend({
    ajax: Ember.inject.service('ajax'),
    store: Ember.inject.service('store'),
    warnings: [],
    rescheduleRecommended: [],
    warningUpdates: Ember.computed('changeSet.postingSchedules', {get() {

            //       console.log("Check warnings");
            var newWarnings = [];
            var newRecommend = [];
            var comp = this;
            Ember.RSVP.all(this.get("changeSet.postingSchedules").map(function(ps) {
                //         console.log("W1");
                //       console.log("isPosted:" + ps.get("isPosted"));
                if (ps.get("isPosted") !== true) {
                    //         console.log("W2");

                    var nt = comp.get("changeSet.networkType");
                    if (ps.get("createdTime") == null) {
                        //     alert("PS IS NEW?!");
                        //           console.log("WN1");

                        //     newWarnings.push("PS is new!");
                        return comp.get("ajax").request("https://gke.contetto.io/review-channels/v1/socialAccounts?networkType=" + nt.get("id") + "&socialAccount=" + ps.get("socialAccount.id")).then((resp) => {

                            // User selects a time too close based on remainingReviewTime
                            //                            newWarnings.push(JSON.stringify(resp));

                            var remaining = resp.data.remainingReviewTime;
                            var psTime = null;
                            if (ps.get("dateTime") != null) {
                                psTime = ps.get("dateTime");
                            }
                            else {
                                if (ps.get("tempTime") == null) {
                                    //        console.log("temp null");
                                    if (ps.get("dateTime") == null) {
                                        //          console.log("dt null null");
                                        psTime = ps.get("auto");
                                        //        console.log("auto " + psTime);

                                    }
                                    else {
                                        psTime = ps.get("dateTime");
                                    }
                                }
                                else {
                                    psTime = ps.get("tempTime");
                                }
                            }
                            //      console.log("Pstime: " + psTime);
                            psTime = new Date(psTime);

                            var remainingMS = remaining * 60 * 60 * 1000;
                            var now = new Date();
                            if (psTime > now) {
                                //        console.log(psTime + " > " + now);
                                if (psTime - remainingMS < now) {
                                    newWarnings.push("Your post may not be reviewed by the time it is scheduled to go out to " + ps.get("socialAccount.platform") + ": " + ps.get("socialAccount.title"));
                                }
                            }
                            else {
                                //      console.log(psTime + " < " + now);
                                newRecommend.pushObject(ps);
                            }
                            // The postingSchedule time is less than readyOffset away and requires changes -- large warning
                            var readyOffset = 24;
                            if (ps.get("socialAccount.readyOffset") != null) {
                                readyOffset = ps.get("socialAccount.readyOffset");
                            }

                            var readyOffsetMS = readyOffset * 60 * 60 * 1000;
                            ///post isnt read if:  changeSet.isDraft === true || resp.data.scheduleOK === false
                            if (psTime > now) {

                                if (now + readyOffsetMS < psTime) {
                                    /*global moment*/
                                    if (comp.get("changeSet.isDraft") === true || resp.data.scheduleOK === false) {
                                        // The postingSchedule time is less than readyOffset away and requires changes -- large warning
                                        newWarnings.push("You have specified that posts should be ready " + readyOffset + " hours before they are scheduled. The post is scheduled to go out to " + ps.get("socialAccount.platform") + ": " + ps.get("socialAccount.title") + " in " + moment(psTime).fromNow() + " and it's not yet ready.");
                                    }
                                }
                            }
                            else {
                                //   newWarnings.push("Your post failed to go to " + ps.get("socialAccount.platform") + ": " + ps.get("socialAccount.title"));
                            }

                            if (psTime > now) {
                                //           console.log("fire up the request..");
                                return Ember.RSVP.all(comp.get("store").query("postingSchedule", {
                                    'brand': comp.get("changeSet.brand.id"),
                                    'networkTypes': comp.get("changeSet.networkType.id"),
                                    'socialAccounts': ps.get('socialAccount.id'),
                                    'fromDate': moment(psTime).utc().format(),
                                    'endDate': moment(psTime).utc().format()
                                }).map(function(cresp) {
                                    //  console.log("Request is back!");
                                    if (cresp.get("posting.id") != comp.get("changeSet.id")) {
                                        var warning = "Your post to  " + ps.get("socialAccount.platform") + ": " + ps.get("socialAccount.title") + " will collide with a scheduled post. <br/><strong>Topic</strong>: <a target=_blank href='" + comp.router.generate('brand.edit.post.edit', comp.get("changeSet.brand"), cresp.get('posting')) + "'>" + cresp.get("posting.topic") + "</a>";

                                        if (ps.get('dateTime') != null) {
                                            if (cresp.get('dateTime') != null) {
                                                warning += "<br/>Both posts will go out at the same time.";
                                            }
                                            else {
                                                warning += "<br/>If you continue, that post will be rescheduled.";
                                            }
                                        }
                                        else {
                                            if (cresp.get('dateTime') != null) {
                                                warning += "<br/>If you continue, this post will be rescheduled, unless you change from automatic to specified mode.";
                                            }
                                            else {

                                                if (ps.get("createdTime") > cresp.get("createdTime")) {
                                                    warning += "<br/>This post was scheduled first. So that post will be rescheduled, if you continue.";
                                                }
                                                else {
                                                    warning += "<br/>That post was scheduled first. So this post will be rescheduled, if you continue.";
                                                }
                                            }
                                        }


                                        newWarnings.push(warning);
                                    }
                                    else {
                                        //     console.log("I see myself o.O");
                                    }
                                    return true;
                                }));
                            }

                        });
                    }
                    else {
                        //    newWarnings.push("PS is old!");
                        return comp.get("ajax").request("https://gke.contetto.io/review-channels/v1/postingSchedules?postingSchedule=" + ps.get("id")).then((resp) => {

                            // User selects a time too close based on remainingReviewTime
                            //  newWarnings.push(JSON.stringify(resp));

                            var remaining = resp.data.remainingReviewTime;
                            var psTime = null;
                            if (ps.get("dateTime") != null) {
                                psTime = ps.get("dateTime");
                            }
                            else {
                                if (ps.get("tempTime") == null) {
                                    //      console.log("temp null");
                                    if (ps.get("dateTime") == null) {
                                        //  console.log("dt null null");
                                        psTime = ps.get("auto");
                                        //   console.log("auto " + psTime);

                                    }
                                    else {
                                        psTime = ps.get("dateTime");
                                    }
                                }
                                else {
                                    psTime = ps.get("tempTime");
                                }
                            }
                            psTime = new Date(psTime);
                            var remainingMS = remaining * 60 * 60 * 1000;
                            var now = new Date();
                            if (psTime > now) {
                                if (psTime - remainingMS < now) {

                                    newRecommend.pushObject(ps);
                                }
                            }

                            // The postingSchedule time is less than readyOffset away and requires changes -- large warning
                            var readyOffset = 24;
                            if (ps.get("socialAccount.readyOffset") != null) {
                                readyOffset = ps.get("socialAccount.readyOffset");
                            }

                            var readyOffsetMS = readyOffset * 60 * 60 * 1000;
                            ///post isnt read if:  changeSet.isDraft === true || resp.data.scheduleOK === false
                            if (psTime > now) {

                                if (now + readyOffsetMS < psTime) {
                                    /*global moment*/
                                    if (comp.get("changeSet.isDraft") === true || resp.data.scheduleOK === false) {
                                        // The postingSchedule time is less than readyOffset away and requires changes -- large warning
                                        newWarnings.push("You have specified that posts should be ready " + readyOffset + " hours before they are scheduled. The post is scheduled to go out to " + ps.get("socialAccount.platform") + ": " + ps.get("socialAccount.title") + " in " + moment(psTime).fromNow() + " and it's not yet ready.");
                                    }
                                }
                            }
                            else {
                                newRecommend.pushObject(ps);
                            }


                            if (psTime > now) {

                                //  console.log("fire up the request..");
                                return Ember.RSVP.all(comp.get("store").query("postingSchedule", {
                                    'brand': comp.get("changeSet.brand.id"),
                                    'networkTypes': comp.get("changeSet.networkType.id"),
                                    'socialAccounts': ps.get('socialAccount.id'),
                                    'fromDate': moment(psTime).utc().format(),
                                    'endDate': moment(psTime).utc().format()
                                }).map(function(cresp) {
                                    //   console.log("Request is back!");
                                    if (cresp.get("posting.id") != comp.get("changeSet.id")) {
                                        var warning = "Your post to  " + ps.get("socialAccount.platform") + ": " + ps.get("socialAccount.title") + " will collide with a scheduled post. <br/><strong>Topic</strong>: <a target=_blank href='" + comp.router.generate('brand.edit.post.edit', comp.get("changeSet.brand"), cresp.get('posting')) + "'>" + cresp.get("posting.topic") + "</a>";

                                        if (ps.get('dateTime') != null) {
                                            if (cresp.get('dateTime') != null) {
                                                warning += "<br/>Both posts will go out at the same time.";
                                            }
                                            else {
                                                warning += "<br/>If you continue, that post will be rescheduled.";
                                            }
                                        }
                                        else {
                                            if (cresp.get('dateTime') != null) {
                                                warning += "<br/>If you continue, this post will be rescheduled, unless you change from automatic to specified mode.";
                                            }
                                            else {

                                                if (ps.get("createdTime") > cresp.get("createdTime")) {
                                                    warning += "<br/>This post was scheduled first. So that post will be rescheduled, if you continue.";
                                                }
                                                else {
                                                    warning += "<br/>That post was scheduled first. So this post will be rescheduled, if you continue.";
                                                }
                                            }
                                        }


                                        newWarnings.push(warning);

                                    }
                                    else {
                                        //       console.log("I see myself o.O");
                                    }
                                }));
                            }
                        });
                    }


                    // Show collisions for postingSchedules and what will happen (temp will move, specified will not)
                }
            })).then(function() {

                comp.set('warnings', newWarnings);
                comp.set('rescheduleRecommended', newRecommend);
            });
            return new Date();
        }
    }),
    init: function() {

        return this._super();
    },
    actions: {
        setSpecified(ps, time) {
            //  alert("2- " + time);
            this.get('setSpecified')(ps, time);
        }
    }
});
