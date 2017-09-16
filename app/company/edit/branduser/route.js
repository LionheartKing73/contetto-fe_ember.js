import Ember from 'ember';

export default Ember.Route.extend({
    model({
        brand_id
    }) {
        const {
            company_id
        } = this.paramsFor('company.edit');
        return Ember.RSVP.hash({
            company: this.store.findRecord('company', company_id),
            brand: this.store.findRecord('brand', brand_id),

            roles: this.store.query('brandRole', {
                id: brand_id
            })
        });
    }
});
