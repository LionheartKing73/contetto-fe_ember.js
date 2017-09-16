import Ember from 'ember';

const {
  Route,
  isEmpty,
  get
} = Ember;

export default Route.extend({
  beforeModel(){
    const company = this.modelFor('company.edit');
    const brands = get(company, 'brands');
    if (!isEmpty(brands)) {
      this.transitionTo('brand', company);
    } else {
      this.transitionTo('company.edit.details', company);
    }
  }
});
