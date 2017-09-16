import Ember from 'ember';

export default Ember.Component.extend({
    store: Ember.inject.service('store'),
    networkTypes: Ember.computed('netTypes', {get() {
            return this.get('netTypes');
        }
    }),
    netTypes: [],
    init: function() {
        var component = this;
        this.get('store').fetchRecord('networkType', '1').then((nt) => {
            component.get('netTypes').pushObject(nt);

        });
        this.get('store').fetchRecord('networkType', '2').then((nt) => {
            component.get('netTypes').pushObject(nt);
        });
        return this._super();
    },

    actions: {
        changeNetworkTypes: function(nts) {
            this.get("updateNetworkTypes")(nts);
        }
    }
});
