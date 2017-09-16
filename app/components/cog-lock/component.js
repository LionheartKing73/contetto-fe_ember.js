import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ['coglocker', 'c'],
    tagName: "span",
    displayIt: false,
    click(event) {
        if (event.target.dataset.toggable === "true") {
            var element = Ember.$(event.target);
            if (this.get("displayIt")) {
                this.set("displayIt", false);

                this.$().addClass("c");

                this.$().removeClass("o");
                if (this.get("dashlocker") == "yes") {
                    this.$().parent().parent().removeClass("cog-open");
                }
            }
            else {
                this.set("displayIt", true);
                this.$().addClass("o");
                this.$().removeClass("c");
                if (this.get("dashlocker") == "yes") {
                    this.$().parent().parent().addClass("cog-open");
                }

            }
        }
    }
});
