import Ember from 'ember';

export default Ember.Component.extend({
    actions: {
        removeBrand(brand) {
            var entry = prompt("Are you sure you want to remove this brand?\n\nWARNING: Deleting a brand is irreversible and will prevent any scheduled posts from being sent, all brand data and metrics will be deleted.\n\nTo remove this brand enter the brand name exactly as shown:\n" + brand.get('name'));
            if (entry == brand.get('name')) {
                if (confirm("Are you really sure you want to delete this brand?")) {
                    brand.deleteRecord();
                    brand.save().then(function() {
                        alert("Brand deleted!");
                    });
                }
            }
        }
    }
});
