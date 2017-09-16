import Ember from 'ember';
import _ from "npm:underscore";
import { AGE_RANGES, GENDER } from 'contetto/constants/audience-types';
import audienceValidations from 'contetto/validations/target-audience';

const { Route, RSVP, setProperties, get } = Ember;

export default Route.extend({
  model({ brand_id, company_id }){
    return RSVP.hash({
      brand_id,
      company_id,
      brand: this.store.findRecord('brand', brand_id)
    });
  },

  afterModel(model){
    let audience = this.store.createRecord('audience', { title: _.uniqueId('audience'), brand: model.brand });
    setProperties(model, { audience, audienceValidations });

    return RSVP.allSettled([
      this.store.query('audiences-data', { type: AGE_RANGES }),
      this.store.query('audiences-data', { type: GENDER }),
      this.store.queryRecord('audiencesRecommending', { vertical: get(model, 'brand.vertical.id') })
    ]).then(([ ageRanges, genders, recommended ]) => {
      setProperties(model, {
        ageRanges: ageRanges.state === 'fulfilled' ? ageRanges.value : null,
        genders: genders.state === 'fulfilled' ? genders.value : null,
        recommendedAgeRanges: recommended.state === 'fulfilled' ? get(recommended, 'value.ageRanges') : [],
        recommendedGenders: recommended.state === 'fulfilled' ? get(recommended, 'value.genders') : [],
      });
    });
  },

  deactivate(){
    if (this.currentModel.audience.get('isNew')) {
      this.currentModel.audience.destroyRecord();
    }
  }
});
