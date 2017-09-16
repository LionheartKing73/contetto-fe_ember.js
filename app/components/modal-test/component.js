import Ember from 'ember';

export default Ember.Component.extend({
    showModal: false,
    actions: {
        toggleModal() {
            if (this.get("showModal")) {
                this.set("showModal", false);
            }
            else {
                this.set("showModal", true);
            }
        },
        postDone: function(item) {}
    }
});
