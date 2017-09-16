import DS from 'ember-data';
import Ember from 'ember';
export default DS.Store.extend({

    init: function() {
        // console.log('Using custom store!');
        return this._super.apply(this, arguments);
    },
    fetchRecord: function(model, id) {
        if (id == null) {
            alert("Null for " + model);
        }
        var service = this;
        if (this.hasRecordForId(model, id)) {
            return new Ember.RSVP.Promise(function(resolve, reject) {
                resolve(service.peekRecord(model, id));
            });
        }
        else {
            return this.findRecord(model, id);
        }
    }
});
