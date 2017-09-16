import Ember from 'ember';

export default Ember.Component.extend({
    autoOptions: [{
        'name': 'All',
        'id': 'all'
    }, {
        'name': 'Automatic Posts',
        'id': 'true'
    }, {
        'name': 'Manually Scheduled',
        'id': 'false'
    }],
    autoSelected: {
        'name': 'All',
        'id': 'all'
    },
    actions: {
        changeAuto: function(auto) {
            this.set("autoSelected", auto);
            this.get("updateAuto")(auto.id);
        }
    }
});
