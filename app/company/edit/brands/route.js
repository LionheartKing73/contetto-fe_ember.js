import Ember from 'ember';
import CompanyValidations from 'contetto/validations/company';

const {
    Route,
    inject,
    RSVP,
    set
} = Ember;

// CompanyDetailsRoute
export default Route.extend({
    session: inject.service(),
    //model
    model() {
        const company = this.modelFor('company.edit');
        return RSVP.hash({
            company,
            CompanyValidations,
            locations: this.store.findAll('location', {
                backgroundReload: false
            }),
            notifications: this.store.findAll('notification')
        });
    },

    afterModel() {
        set(this, 'session.brand', null);
    }
});
