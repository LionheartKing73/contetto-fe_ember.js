/*********************
Used for Brand (Add)
**********************/

import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import BrandValidations from 'contetto/validations/brand';

const {
  Route,
  get,
  set,
  inject: {service}
} = Ember;

// Constant BrandsAddRoute
export default Route.extend(AuthenticatedRouteMixin, {
  //get storage session
  companyDetail: service('current-company'),
  //get Toast
  toast: Ember.inject.service(),
  //model
  model() {
    return Ember.RSVP.hash({
      BrandValidations,
      verticals: this.store.findAll('vertical'),
      locations: this.store.findAll('location'),
      brand: this.store.createRecord('brand') //Create brand record
    });
  },
  afterModel(model) {
    const companyId = get(this, 'companyDetail.data.companyId');

    if (companyId) {
      this.store.findRecord('company', companyId).then((res) => {
        model.brand.setProperties({
          'company': res,
          'companyId': companyId
        });
      });
      set(model, 'brand.companyId', companyId);
    } else {
      this.transitionTo('home');
    }
  }
});

