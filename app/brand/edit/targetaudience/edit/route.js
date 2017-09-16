import Ember from 'ember';
import { AGE_RANGES, GENDER } from 'contetto/constants/audience-types';
import audienceValidations from 'contetto/validations/target-audience';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';

const { Route, RSVP, setProperties, get } = Ember;

export default Route.extend({
	model({ audience_id }){
		const { brand_id } = this.paramsFor('brand.edit');
		const { company_id } = this.paramsFor('company.edit');
		var audience = this.store.findRecord('audience', audience_id);
		return RSVP.hash({
			brand_id,
			company_id,
			audienceValidations,
			brand: this.modelFor('brand.edit'),
			audience,
			genders: this.store.query('audiences-data', { type: GENDER }),
			ageRanges: this.store.query('audiences-data', { type: AGE_RANGES }),
			changeset: new Changeset(audience, lookupValidator(audienceValidations), audienceValidations)
		});
	},

	afterModel(model){
		return RSVP.allSettled([
			this.store.queryRecord('audiencesRecommending', { vertical: get(model, 'brand.vertical.id') })
		]).then(([ recommended ]) => {
			setProperties(model, {
				recommendedAgeRanges: recommended.state === 'fulfilled' ? get(recommended, 'value.ageRanges') : [],
				recommendedGenders: recommended.state === 'fulfilled' ? get(recommended, 'value.genders') : [],
			});
		});
	},

	deactivate(){
		if(this.currentModel.audience.get("hasDirtyAttributes")){
			this.currentModel.audience.rollbackAttributes();
		}
	},
	actions: {
    willTransition: function(transition){
      if(!this.currentModel.changeset.get("isDirty")){
        return true;
      }
      else if(confirm("Your information will be lost, if you exit this page. Are you sure?")){
        return true;
      }
      else{
        transition.abort();
      }
    }
  }
});
