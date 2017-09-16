import Ember from 'ember';

export default Ember.Component.extend({
    actions: {
        changeCategories: function(categories) {
            this.get("updateCategories")(categories);
        }
    }
});
