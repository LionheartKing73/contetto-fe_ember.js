import Ember from 'ember';

const {
  Route,
	set,
} = Ember;

export default Route.extend({
	setupController(_, model) {
    const { brand_id, company_id } = this.paramsFor('setup.schedule');

    this._super(_,{
			brandId: brand_id,
			companyId: company_id,
		});
	}
});
