import Ember from 'ember';

export default Ember.Component.extend({
    startOptions: [{
        'id': 'now',
        'name': 'Start Now'
    }, {
        'id': 'specify',
        'name': 'Specify a Time'
    }],
    startOption: {
        'id': 'specify',
        'name': 'Specify a Time'
    },
    init() {

        return this._super();
    },

    specify: Ember.computed('startOption', {get() {
            if (this.get("startOption.id") == "specify") {
                return true;
            }
            return false;
        }
    }),
    setTime: function(time) {
        //  console.log("set 3 time");
        this.set("campaign.startDate", time);
        this.get("recheck")();
    },
    actions: {
        updateTime: function(time) {
            Ember.run.once(this, "setTime", time);
        },
        setStartOption: function(so) {
            this.set("startOption", so);
            if (so.id == "now") {
                /*global moment*/
                //  this.set("campaign.startDate", moment().utc().format());
            }

        },
        previousStep() {
            this.get("previousStep")();
        },
        nextStep() {
            this.get("nextStep")();
        }
    }

});
