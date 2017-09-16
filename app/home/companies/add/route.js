/*********************
Used for Company (Add)
**********************/

import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import CompanyValidations from 'contetto/validations/company';

const {
  Route,
  RSVP: { hash }
} = Ember;

// CompaniesAddRoute
export default Route.extend(AuthenticatedRouteMixin, {
  //model
  model() {
    return hash({
      CompanyValidations,
      locations: this.store.findAll('location'),
      company: this.store.createRecord('company')
    });
  }
});
