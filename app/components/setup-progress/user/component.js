import Ember from 'ember';
const {
    Component,
    computed,
    inject
} = Ember;
export default Component.extend({
    session: inject.service('session'),
    store: inject.service('store'),
    count: 5,
    user: computed('session.data.authenticated.userId', function() {
        return this.get("store").findRecord("user", this.get("session.data.authenticated.userId"));
    }),
    dnd: computed('user.dndEndHour', 'user.dndEndMinute', 'user.dndStartHour', 'user.dndStartMinute', 'dndTimezone', function() {
        return !!this.get("user.dndEndHour") || !!this.get("user.dndEndMinute") || !!this.get("user.dndStartHour") || !!this.get("user.dndStartMinute") && !!this.get("user.dndTimezone");
    }),
    email: computed('user.allowEmail', 'user.email', 'user.emailInterval', 'user.isVerified', function() {
        return this.get("user.allowEmail") && !!this.get("user.email") && !!this.get("user.emailInterval") && this.get("user.isVerified");
    }),
    sms: computed('user.smsInterval', 'user.smsPhone', 'user.smsVerified', 'user.allowSMS', function() {
        return !!this.get('user.smsInterval') && !!this.get('user.smsPhone') && this.get('user.smsVerified') && this.get('user.allowSMS');
    }),
    fcm: computed('user.devices.length', function() {
        return !!this.get('user.devices.length');
    }),
    profile: computed('user.about', 'user.address', 'user.city', 'user.firstName', 'user.isVerified', 'user.lastName', 'user.phone', 'user.postalCode', 'user.timezone', 'user.state.id', 'user.country.id', function() {
        return !!this.get('user.about'), !!this.get('user.address'), !!this.get('user.city'), !!this.get('user.firstName'), !!this.get('user.isVerified'), !!this.get('user.lastName'), !!this.get('user.phone'), !!this.get('user.postalCode'), !!this.get('user.timezone'), !!this.get('user.state.id'), !!this.get('user.country.id');
    }),
    doneCount: computed('dnd', 'email', 'sms', 'fcm', 'profile', function() {
        return this.get('dnd') + this.get('email') + this.get('sms') + this.get('fcm') + this.get('profile');
    }),
    donePerc: computed('count', 'doneCount', {get() {
            if (this.get("count") > 0) {
                return Math.round((this.get("doneCount") / this.get("count")) * 100);
            }
            return 0;
        }
    }),
    actions: {
        link() {
            this.get("router").transitionTo("user.setup");
        },
        manageUser() {
            this.get("router").transitionTo("user.notification.manage");
        },
        userProfile() {
            this.get("router").transitionTo("user.details");
        }
    }

});
