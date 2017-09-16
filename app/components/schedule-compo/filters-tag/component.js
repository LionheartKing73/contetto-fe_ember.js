import Ember from 'ember';

export default Ember.Component.extend({
    actions: {
        changeTags: function(tags) {
            this.get("updateTags")(tags);
        }
    }
});
