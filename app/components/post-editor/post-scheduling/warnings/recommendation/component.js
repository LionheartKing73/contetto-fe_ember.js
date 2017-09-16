import Ember from 'ember';

export default Ember.Component.extend({
    ajax: Ember.inject.service('ajax'),
    autoTime: null,
    didInsertElement: function() {
        Ember.run.once(this, 'autoTimeFetch');
    },
    recheckTime: function() {
        Ember.run.later(this, function() {
            var currentTime = new Date();
            var postTime = this.get('autoTime').toDate();
            if (currentTime > postTime) {
                this.autoTimeFetch();
            }
            else {
                this.recheckTime();
            }
        }, 3000)
    },
    autoTimeFetch: function() {
        var component = this;
        this.get('ajax').request('https://gke.contetto.io/postings/v1/postTime?brand=' + component.get('ps.socialAccount.brand.id') + '&account=' + component.get('ps.socialAccount.id') + '&type=' + component.get('changeSet.networkType.id')).then(response => {
            var s = JSON.stringify(response);
            var o = JSON.parse(s);
            if (!o.data.attributes.dateTime) {
                component.set('noauto', true);
                component.doSetMode({
                    'value': 'specify',
                    'name': 'Specify Time'
                });
            }
            /*global moment*/
            var currentTime = new Date();
            var postTime = new Date(o.data.attributes.dateTime);
            if (currentTime > postTime) {
                component.autoTimeFetch();
            }
            else {
                component.set("autoTime", moment(o.data.attributes.dateTime));
                component.recheckTime();
            }
        });
    },
    actions: {
        setSpecified(ps, time) {
            //   alert("1- " + time);
            this.get("setSpecified")(ps, time);
        }
    }
});
