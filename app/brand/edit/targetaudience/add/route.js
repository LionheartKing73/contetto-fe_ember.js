import Ember from 'ember';
import _ from "npm:underscore";
import { AGE_RANGES, GENDER } from 'contetto/constants/audience-types';
import audienceValidations from 'contetto/validations/target-audience';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';

const { Route, RSVP, setProperties, get } = Ember;

export default Route.extend({
	model(){
		const { brand_id } = this.paramsFor('brand.edit');
		const { company_id } = this.paramsFor('company.edit');
		return RSVP.hash({
			brand_id,
			company_id,
			brand: this.store.findRecord('brand', brand_id)
		});
	},

	afterModel(model){
		let audience = this.store.createRecord('audience', { title: "", brand: model.brand });
		setProperties(model, { audience, audienceValidations });
		setProperties(model, { changeset: new Changeset(audience, lookupValidator(audienceValidations), audienceValidations) });
		return RSVP.allSettled([
			this.store.query('audiences-data', { type: GENDER }),
			this.store.query('audiences-data', { type: AGE_RANGES }),
			this.store.queryRecord('audiencesRecommending', { vertical: get(model, 'brand.vertical.id') })
		]).then(([ genders, ageRanges, recommended ]) => {
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
