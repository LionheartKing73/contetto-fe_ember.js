import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import { AGE_RANGES, GENDER } from 'contetto/constants/audience-types';
import targetAudienceValidation from 'contetto/validations/target-audience';


const {
  get,
  Route,
  RSVP: { hash }
} = Ember;

export default Route.extend(AuthenticatedRouteMixin, {
  model(params) {
    const brand = this.modelFor('brand.edit');
    const store = get(this, 'store');

    return hash({
      brand,
      targetAudienceValidation,
      audience: this.getAudienceModel(params),
      locations: store.findAll('location'),
      ageRanges: store.query('audiences-data', { type: AGE_RANGES }),
      genders: store.query('audiences-data', { type: GENDER }),
      isTargetAudienceTabActive: true
    });
  },

  getAudienceModel(){
    return get(this, 'store').createRecord('audience', {
      brand: this.modelFor('brand.edit')
    });
  }

});
