/*********************
 Used for Account Settings (Details)
 **********************/

import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import UserValidations from 'contetto/validations/user';

const {
    Route,
    inject: {
        service
    },
    get,
    RSVP: { hash },
    isEmpty,
    isArray,
    setProperties
} = Ember;

// Constant AccountSettingDetailsRoute
export default Route.extend(AuthenticatedRouteMixin, {
    session: service('session'),
    //get Toast
    toast: service(),

    //model
    model() {
        //Get model's data'
        let userId = this.get('session.data.authenticated.userId');
        return hash({
            UserValidations,
            locations: this.store.findAll('location'),
            user: this.store.findRecord('user', userId),
            isDetailsTabActive: true,
            data: Ember.Object.create({
                isSubmitted: false
            })
        });
    },

    afterModel: function(model) {
        return new Promise((resolve, reject) => {
            const countryId = get(model, 'user.country.id');
            const stateId = get(model, 'user.state.id');

            if (!isEmpty(countryId) && isArray(get(model, 'locations'))) {
                const selectedCountry = get(model, 'locations').findBy('id', countryId);
                if (!isEmpty(selectedCountry)) {
                    this.store.query('location', { country: countryId }).then(states => {
                        const selectedState = isArray(states) && !isEmpty(stateId) ? states.findBy('id', stateId) : null;
                        setProperties(model, {
                            selectedCountry,
                            selectedState,
                            states: states || []
                        });
                        resolve(model);
                    }).catch(reject);
                } else {
                    resolve(model);
                }
            } else {
                resolve(model);
            }
        });
    }
});