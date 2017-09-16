import Ember from 'ember';

export default Ember.Component.extend({

    init() {
        // Instance the tour
        var tour = new Tour({
            steps: [{
                element: "#step1",
                title: "Title of my step",
                content: "Content of my step"
            }, {
                element: "#step2",
                title: "Title of my step2",
                content: "Content of my step2"
            }, {
                element: "#step3",
                title: "Title of my step3",
                content: "Content of my step3"
            }]
        });
        this.set("tour", tour);
        this._super();
    },
    actions: {

        startTour() {
            this.get("tour").init();
            this.get("tour").start();

        }
    }

});
