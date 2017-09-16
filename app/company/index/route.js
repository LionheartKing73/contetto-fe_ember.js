import Ember from 'ember';

const {
  Route,
  isEmpty,
  get
} = Ember;

export default Route.extend({
  beforeModel(){
    const companies = this.modelFor('company').companies;
    if (isEmpty(companies.filterBy('isNew', false))) {
      this.transitionTo('index');
    } else {
      const brands = get(companies, 'firstObject.brands');
      if (!isEmpty(brands)) {
        this.transitionTo('brand', get(companies, 'firstObject'));
      } else {
        this.transitionTo('company.edit.details', get(companies, 'firstObject'));
      }
    }
  }
});
