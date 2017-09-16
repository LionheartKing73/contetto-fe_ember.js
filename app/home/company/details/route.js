/*********************
Used for Company (Details)
**********************/

import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import CompanyValidations from 'contetto/validations/company';

const {
  Route,
  get,
  RSVP: { hash },
  isEmpty,
  isArray,
  setProperties
} = Ember;

// CompanyDetailsRoute
export default Route.extend(AuthenticatedRouteMixin, {
  //model
  model() {
    let comp_id = this.modelFor('home.company').comp_id;
    return hash({
      CompanyValidations,
      locations: this.store.findAll('location'),
      company: this.store.findRecord('company', comp_id),
      isDetailsTabActive: true,
    });
  },
  afterModel: function (model) {
    return new Promise((resolve, reject) => {
      const countryId = get(model, 'company.country.id');
      const stateId = get(model, 'company.state.id');

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

