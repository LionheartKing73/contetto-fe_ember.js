import Ember from 'ember';

export default Ember.Service.extend({

    activeTour: null,
    tourStep: 0,
    tours: [],
    activateTour(name, step) {
        var tour = this.get("tours")[name];
        tour.init();
        tour.start();
        if (step) {
            tour.goTo(step);
            this.set("tourStep", step);
        }
        this.set("activeTour", tour);
    },

    checkStatus() {
        if (this.get("activeTour")) {
            this.activateTour(this.get("activeTour"), this.get("tourStep"));
        }
    },

    stopTour() {
        this.get("activeTour").end();
        this.set("activeTour", null);
        this.set("tourStep", 0);
    }
});
