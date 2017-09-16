import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import BrandValidations from 'contetto/validations/brand';

const {
  Route,
  get,
  RSVP: { hash },
  isEmpty,
  isArray,
  setProperties
} = Ember;

export default Route.extend(AuthenticatedRouteMixin, {
  model() {
    return hash({
      BrandValidations,
      verticals: this.store.findAll('vertical'),
      locations: this.store.findAll('location'),
      isDetailsTabActive: true,
      brand: this.modelFor('brand.edit')
    });
  },
  afterModel: function (model) {
    return new Promise((resolve, reject) => {
      const countryId = get(model, 'brand.country.id');
      const stateId = get(model, 'brand.state.id');
      const selectedVertical = get(model, 'brand.vertical');

      if (!isEmpty(countryId) && isArray(get(model, 'locations'))) {
        const selectedCountry = get(model, 'locations').findBy('id', countryId);
        if (!isEmpty(selectedCountry)) {
          this.store.query('location', { country: countryId }).then(states => {
            const selectedState = isArray(states) && !isEmpty(stateId) ? states.findBy('id', stateId) : null;
            setProperties(model, {
              selectedVertical,
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
